const Database = require('better-sqlite3');
const fs = require('fs');
const db = new Database('local.db');

const log = [];
function consoleLog(...args) {
    log.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
}

try {
    // Check count
    const count = db.prepare("SELECT COUNT(*) as count FROM fixtures").get();
    consoleLog('Current fixture count:', count.count);

    // Check table info
    const tableInfo = db.prepare("PRAGMA table_info(fixtures)").all();
    consoleLog('Fixtures schema:', tableInfo);

    // Try to insert a dummy fixture manually to see if it works
    const fixtureId = 'test-fix-' + Date.now();

    // We need valid sport_id, team_id, venue_id
    const sport = db.prepare("SELECT id FROM sports LIMIT 1").get();
    const teamA = db.prepare("SELECT id FROM teams LIMIT 1").get();
    const teamB = db.prepare("SELECT id FROM teams LIMIT 1 OFFSET 1").get();
    const venue = db.prepare("SELECT id FROM venues LIMIT 1").get();

    if (!sport || !teamA || !teamB || !venue) {
        consoleLog('Cannot create test fixture: Missing reference data (sports/teams/venues)');
    } else {
        consoleLog('Inserting test fixture...');
        const stmt = db.prepare(`
      INSERT INTO fixtures (id, sport_id, team_a_id, team_b_id, venue_id, match_date, match_time, status, round) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        stmt.run(fixtureId, sport.id, teamA.id, teamB.id, venue.id, '2026-02-01', '12:00', 'upcoming', 'Test Round');
        consoleLog('Insert successful.');

        // Read back
        const row = db.prepare("SELECT * FROM fixtures WHERE id = ?").get(fixtureId);
        consoleLog('Read back fixture:', row);
    }

} catch (error) {
    consoleLog('Error:', error);
}

fs.writeFileSync('output_clean.txt', log.join('\n'));
