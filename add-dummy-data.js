const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addDummyData() {
  try {
    // Get existing sports
    const { data: sports, error: sportsError } = await supabase
      .from('sports')
      .select('id, slug')
      .limit(5);

    if (sportsError) throw sportsError;
    console.log(`Found ${sports.length} sports`);

    // Define new teams
    const newTeams = [
      { name: 'Code Ninjas', short_name: 'CN', colors: ['#FF1744', '#FFFFFF'] },
      { name: 'DevOps Dragons', short_name: 'DD', colors: ['#2196F3', '#FFFFFF'] },
      { name: 'Data Wizards', short_name: 'DW', colors: ['#9C27B0', '#FFFFFF'] },
      { name: 'Cloud Coders', short_name: 'CC', colors: ['#00BCD4', '#FFFFFF'] },
      { name: 'Test Titans', short_name: 'TT', colors: ['#4CAF50', '#FFFFFF'] },
      { name: 'API Aces', short_name: 'AA', colors: ['#FF9800', '#FFFFFF'] },
      { name: 'Database Legends', short_name: 'DL', colors: ['#F44336', '#FFFFFF'] },
      { name: 'Frontend Fighters', short_name: 'FF', colors: ['#3F51B5', '#FFFFFF'] },
      { name: 'Backend Bosses', short_name: 'BB', colors: ['#009688', '#FFFFFF'] },
      { name: 'QA Warriors', short_name: 'QW', colors: ['#795548', '#FFFFFF'] },
    ];

    // Insert new teams
    let allTeams = [];
    for (const sport of sports) {
      for (const team of newTeams) {
        const { data: existingTeam } = await supabase
          .from('teams')
          .select('id')
          .eq('sport_id', sport.id)
          .eq('name', team.name)
          .single();

        if (!existingTeam) {
          const { data: newTeam, error: teamError } = await supabase
            .from('teams')
            .insert({
              name: team.name,
              short_name: team.short_name,
              sport_id: sport.id,
              primary_color: team.colors[0],
              secondary_color: team.colors[1],
            })
            .select()
            .single();

          if (teamError) {
            console.error(`Error adding team ${team.name}:`, teamError.message);
          } else {
            allTeams.push({ ...newTeam, sport_slug: sport.slug });
            console.log(`Added team: ${team.name}`);
          }
        }
      }
    }

    // Get venues
    const { data: venues } = await supabase.from('venues').select('id').limit(5);
    console.log(`Found ${venues.length} venues`);

    // Get existing teams
    const { data: existingTeams } = await supabase.from('teams').select('id, sport_id, name');

    // Create 20 fixtures
    const statuses = ['completed', 'upcoming', 'live', 'cancelled'];
    const fixtures = [];

    for (let i = 0; i < 20; i++) {
      const sport = sports[i % sports.length];
      const sportTeams = existingTeams.filter(t => t.sport_id === sport.id);

      if (sportTeams.length < 2) continue;

      const team_a = sportTeams[i % sportTeams.length];
      const team_b = sportTeams[(i + 1) % sportTeams.length];

      if (team_a.id === team_b.id) continue;

      const status = i < 2 ? 'live' : i < 10 ? 'completed' : i < 18 ? 'upcoming' : 'cancelled';
      
      let matchDate = new Date();
      if (status === 'upcoming') {
        matchDate.setDate(matchDate.getDate() + Math.floor(i / 3) + 1);
      } else if (status === 'completed') {
        matchDate.setDate(matchDate.getDate() - Math.floor(i / 3) - 1);
      }

      const matchTime = ['14:00', '16:00', '18:00', '20:00'][i % 4];

      let winner_id = null;
      let is_draw = false;

      if (status === 'completed') {
        const rand = Math.random();
        if (rand < 0.1) {
          is_draw = true;
        } else if (rand < 0.55) {
          winner_id = team_a.id;
        } else {
          winner_id = team_b.id;
        }
      }

      const venue = venues[i % venues.length];

      const { data: fixture, error: fixtureError } = await supabase
        .from('fixtures')
        .insert({
          sport_id: sport.id,
          team_a_id: team_a.id,
          team_b_id: team_b.id,
          venue_id: venue.id,
          match_date: matchDate.toISOString().split('T')[0],
          match_time: matchTime,
          status,
          round: `Round ${Math.floor(i / 2) + 1}`,
          match_number: i + 1,
          winner_id,
          is_draw,
        })
        .select()
        .single();

      if (fixtureError) {
        console.error(`Error adding fixture ${i + 1}:`, fixtureError.message);
      } else {
        fixtures.push(fixture);
        console.log(`Added fixture ${i + 1}: ${team_a.name} vs ${team_b.name} - Status: ${status}`);

        // Add live scores for live and completed matches
        if (status === 'live' || status === 'completed') {
          const team_a_score = Math.floor(Math.random() * 3);
          const team_b_score = Math.floor(Math.random() * 3);

          const { error: scoreError } = await supabase
            .from('live_scores')
            .insert({
              fixture_id: fixture.id,
              team_a_score: { runs: team_a_score },
              team_b_score: { runs: team_b_score },
              current_period: status === 'live' ? '2nd' : 'Final',
              elapsed_time: status === 'live' ? '45:30' : 'Full Time',
            });

          if (scoreError) {
            console.error(`Error adding live score:`, scoreError.message);
          }
        }
      }
    }

    console.log(`\n✓ Successfully added dummy data!`);
    console.log(`  - Teams added: ~${newTeams.length} teams per sport`);
    console.log(`  - Fixtures added: ${fixtures.length}`);
    console.log(`  - Live matches: 2`);
    console.log(`  - Completed matches: 8`);
    console.log(`  - Upcoming matches: 8`);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

addDummyData();
