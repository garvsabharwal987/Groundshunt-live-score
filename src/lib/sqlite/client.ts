import { getDatabase, parseJSON } from './db';

// Mock Supabase-like interface for local SQLite testing
export function createLocalClient() {
  const db = getDatabase();

  return {
    from: (table: string) => createQueryBuilder(db, table),
    auth: {
      getUser: async () => ({
        data: {
          user: {
            id: 'admin-1',
            email: 'admin@sportikon.com'
          }
        },
        error: null,
      }),
      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        // For local testing, accept any login with password "admin123"
        if (password === 'admin123') {
          return {
            data: { user: { id: 'admin-1', email } },
            error: null,
          };
        }
        return { data: { user: null }, error: { message: 'Invalid credentials' } };
      },
      signOut: async () => ({ error: null }),
      updateUser: async () => ({ error: null }),
    },
    channel: () => ({
      on: () => ({ subscribe: () => ({}) }),
      subscribe: () => ({}),
    }),
    removeChannel: () => { },
  };
}

function createQueryBuilder(db: ReturnType<typeof getDatabase>, table: string) {
  let query = '';
  let params: unknown[] = [];
  let selectColumns = '*';
  let conditions: string[] = [];
  let orderBy: string[] = [];
  let limitCount: number | null = null;
  let isInsert = false;
  let isUpdate = false;
  let isDelete = false;
  let insertData: Record<string, unknown> | null = null;
  let updateData: Record<string, unknown> | null = null;
  let shouldReturnSingle = false;

  const builder = {
    select: (columns = '*') => {
      selectColumns = columns;
      return builder;
    },
    insert: (data: Record<string, unknown> | Record<string, unknown>[]) => {
      isInsert = true;
      insertData = Array.isArray(data) ? data[0] : data;
      return builder;
    },
    update: (data: Record<string, unknown>) => {
      isUpdate = true;
      updateData = data;
      return builder;
    },
    delete: () => {
      isDelete = true;
      return builder;
    },
    eq: (column: string, value: unknown) => {
      conditions.push(`${column} = ?`);
      params.push(typeof value === 'boolean' ? (value ? 1 : 0) : value);
      return builder;
    },
    neq: (column: string, value: unknown) => {
      conditions.push(`${column} != ?`);
      params.push(typeof value === 'boolean' ? (value ? 1 : 0) : value);
      return builder;
    },
    in: (column: string, values: unknown[]) => {
      conditions.push(`${column} IN (${values.map(() => '?').join(', ')})`);
      params.push(...values.map(v => typeof v === 'boolean' ? (v ? 1 : 0) : v));
      return builder;
    },
    gte: (column: string, value: unknown) => {
      conditions.push(`${column} >= ?`);
      params.push(typeof value === 'boolean' ? (value ? 1 : 0) : value);
      return builder;
    },
    lte: (column: string, value: unknown) => {
      conditions.push(`${column} <= ?`);
      params.push(typeof value === 'boolean' ? (value ? 1 : 0) : value);
      return builder;
    },
    order: (column: string, options?: { ascending?: boolean }) => {
      const dir = options?.ascending === false ? 'DESC' : 'ASC';
      orderBy.push(`${column} ${dir}`);
      return builder;
    },
    limit: (count: number) => {
      limitCount = count;
      return builder;
    },
    single: () => {
      shouldReturnSingle = true;
      limitCount = 1;
      return builder;
    },
    then: async (resolve: (result: { data: unknown; error: unknown }) => void) => {
      try {
        let result: unknown;

        // Helper to convert values for SQLite
        const convertValue = (v: unknown): unknown => {
          if (typeof v === 'boolean') return v ? 1 : 0;
          if (typeof v === 'object' && v !== null) return JSON.stringify(v);
          return v;
        };

        if (isInsert && insertData) {
          // For news_of_the_day, ensure required fields are present
          if (table === 'news_of_the_day') {
            if (!('publish_date' in insertData)) {
              insertData.publish_date = new Date().toISOString().slice(0, 10);
            }
            if (!('is_published' in insertData)) {
              insertData.is_published = 1;
            }
          }
          let columns = Object.keys(insertData);
          let values = Object.values(insertData);
          // Handle JSON fields and booleans
          const processedValues = values.map(convertValue);
          const id = insertData.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          if (!insertData.id) {
            columns = ['id', ...columns];
            processedValues.unshift(id);
          }
          const placeholders = columns.map(() => '?').join(', ');
          const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
          console.log('SQLite INSERT:', sql);
          console.log('Values:', processedValues);
          db.prepare(sql).run(...processedValues);
          // Return the inserted row
          result = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
          result = processRow(result as Record<string, unknown>, table);

        } else if (isUpdate && updateData) {
          const sets = Object.keys(updateData).map(k => `${k} = ?`);
          const values = Object.values(updateData).map(convertValue);

          const whereClause = conditions.length ? ` WHERE ${conditions.join(' AND ')}` : '';
          const sql = `UPDATE ${table} SET ${sets.join(', ')}${whereClause}`;
          db.prepare(sql).run(...values, ...params);

          // Return updated rows
          if (shouldReturnSingle && conditions.length) {
            const selectSql = `SELECT * FROM ${table}${whereClause}`;
            result = db.prepare(selectSql).get(...params);
            result = processRow(result as Record<string, unknown>, table);
          }

        } else if (isDelete) {
          const whereClause = conditions.length ? ` WHERE ${conditions.join(' AND ')}` : '';
          db.prepare(`DELETE FROM ${table}${whereClause}`).run(...params);
          result = null;

        } else {
          // SELECT query with JOINs for related data
          let sql = buildSelectQuery(table, selectColumns, conditions, orderBy, limitCount, params);

          const rows = shouldReturnSingle
            ? [db.prepare(sql).get(...params)]
            : db.prepare(sql).all(...params);

          result = (rows as Record<string, unknown>[])
            .filter(Boolean)
            .map(row => processRow(row, table));

          if (shouldReturnSingle) {
            result = (result as unknown[])[0] || null;
          }
        }

        resolve({ data: result, error: null });
      } catch (error) {
        resolve({ data: null, error });
      }
    },
  };

  return builder;
}

function buildSelectQuery(
  table: string,
  columns: string,
  conditions: string[],
  orderBy: string[],
  limit: number | null,
  params: unknown[]
): string {
  let sql = `SELECT * FROM ${table}`;

  if (conditions.length) {
    sql += ` WHERE ${conditions.join(' AND ')}`;
  }

  if (orderBy.length) {
    sql += ` ORDER BY ${orderBy.join(', ')}`;
  }

  if (limit) {
    sql += ` LIMIT ${limit}`;
  }

  return sql;
}

function processRow(row: Record<string, unknown> | undefined, table: string): Record<string, unknown> | null {
  if (!row) return null;

  const db = getDatabase();
  const processed = { ...row };

  // Parse JSON fields - common ones
  const jsonFields = ['score_data', 'team_a_score', 'team_b_score', 'old_data', 'new_data'];
  if (table === 'news_of_the_day') {
    jsonFields.push('highlights', 'notable_performances');
    // Convert is_published from integer to boolean
    if (typeof processed.is_published === 'number') {
      processed.is_published = Boolean(processed.is_published);
    }
  }
  for (const field of jsonFields) {
    if (processed[field] && typeof processed[field] === 'string') {
      processed[field] = parseJSON(processed[field] as string);
    }
  }

  // Fetch related data based on table
  if (table === 'fixtures') {
    if (processed.sport_id) {
      processed.sport = db.prepare('SELECT * FROM sports WHERE id = ?').get(processed.sport_id);
    }
    if (processed.team_a_id) {
      processed.team_a = db.prepare('SELECT * FROM teams WHERE id = ?').get(processed.team_a_id);
    }
    if (processed.team_b_id) {
      processed.team_b = db.prepare('SELECT * FROM teams WHERE id = ?').get(processed.team_b_id);
    }
    if (processed.venue_id) {
      processed.venue = db.prepare('SELECT * FROM venues WHERE id = ?').get(processed.venue_id);
    }
    if (processed.winner_id) {
      processed.winner = db.prepare('SELECT * FROM teams WHERE id = ?').get(processed.winner_id);
    }
    // Get live score
    const liveScore = db.prepare('SELECT * FROM live_scores WHERE fixture_id = ?').get(processed.id);
    if (liveScore) {
      const ls = liveScore as Record<string, unknown>;
      // Parse JSON fields in live_score
      for (const field of jsonFields) {
        if (ls[field] && typeof ls[field] === 'string') {
          ls[field] = parseJSON(ls[field] as string);
        }
      }
      processed.live_score = ls;
    }
  }

  // Parse JSON fields for live_scores table too
  if (table === 'live_scores') {
    for (const field of jsonFields) {
      if (processed[field] && typeof processed[field] === 'string') {
        processed[field] = parseJSON(processed[field] as string);
      }
    }
  }

  if (table === 'teams' && processed.sport_id) {
    processed.sport = db.prepare('SELECT * FROM sports WHERE id = ?').get(processed.sport_id);
  }

  if (table === 'points_table') {
    if (processed.team_id) {
      processed.team = db.prepare('SELECT * FROM teams WHERE id = ?').get(processed.team_id);
    }
    if (processed.sport_id) {
      processed.sport = db.prepare('SELECT * FROM sports WHERE id = ?').get(processed.sport_id);
    }
  }

  if (table === 'audit_logs' && processed.user_id) {
    processed.user = db.prepare('SELECT email, full_name FROM users WHERE id = ?').get(processed.user_id);
  }

  return processed;
}
