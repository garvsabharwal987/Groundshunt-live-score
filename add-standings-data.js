const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addStandingsData() {
  try {
    // Get all sports
    const { data: sports, error: sportsError } = await supabase
      .from('sports')
      .select('id, name');

    if (sportsError) throw sportsError;
    console.log(`Found ${sports.length} sports`);

    // For each sport, get all teams and add standings entries
    for (const sport of sports) {
      const { data: teams, error: teamsError } = await supabase
        .from('teams')
        .select('id, name')
        .eq('sport_id', sport.id);

      if (teamsError) throw teamsError;
      console.log(`Found ${teams.length} teams for ${sport.name}`);

      for (const team of teams) {
        // Check if entry already exists
        const { data: existing } = await supabase
          .from('points_table')
          .select('id')
          .eq('sport_id', sport.id)
          .eq('team_id', team.id)
          .single();

        if (!existing) {
          // Generate random standings data
          const played = Math.floor(Math.random() * 15) + 1;
          const won = Math.floor(Math.random() * played) + 1;
          const lost = Math.floor(Math.random() * (played - won)) + 1;
          const drawn = Math.max(0, played - won - lost);
          const points = won * 2 + drawn;
          const nrr = (Math.random() * 2 - 1).toFixed(2);

          const { data: entry, error: insertError } = await supabase
            .from('points_table')
            .insert({
              sport_id: sport.id,
              team_id: team.id,
              played,
              won,
              lost,
              drawn,
              points,
              net_run_rate: parseFloat(nrr),
            })
            .select()
            .single();

          if (insertError) {
            console.error(`Error adding standings for ${team.name}:`, insertError.message);
          } else {
            console.log(`✓ Added standings for ${team.name}`);
          }
        }
      }
    }

    console.log('\n✓ Successfully added standings data!');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

addStandingsData();
