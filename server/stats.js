/*eslint no-console: 0*/

const db = require('./db.js');

const GameService = require('./services/GameService.js');
const env = require('./env.js');

async function runStats() {
    const args = process.argv.slice(2);

    if(args.length < 2) {
        console.error('Must provide start and end date');
        process.exit(1);
    }

    await db.connect(env.dbPath);
    const gameService = new GameService(db.getDb());

    console.info('Running stats between', args[0], 'and', args[1]);

    const games = await gameService.getAllGames(args[0], args[1]);
    let rejected = { singlePlayer: 0, noWinner: 0 };

    console.info('' + games.length, 'total games');

    let players = {};
    let factions = {};
    let alliances = {};
    let factionAlliances = {};

    games.forEach((game) => {
        if(Object.keys(game.players).length !== 2) {
            rejected.singlePlayer++;

            return;
        }

        if(!game.winner) {
            rejected.noWinner++;

            return;
        }

        Object.values(game.players).forEach((player) => {
            if(!players[player.name]) {
                players[player.name] = { name: player.name, wins: 0, losses: 0 };
            }

            if(!factions[player.faction]) {
                factions[player.faction] = { name: player.faction, wins: 0, losses: 0 };
            }

            if(!alliances[player.alliance]) {
                alliances[player.alliance] = { name: player.alliance, wins: 0, losses: 0 };
            }

            if(!factionAlliances[player.faction + player.agenda]) {
                factionAlliances[player.faction + player.agenda] = {
                    name: player.faction + ' / ' + player.agenda,
                    wins: 0,
                    losses: 0
                };
            }

            var playerStat = players[player.name];
            var factionStat = factions[player.faction];
            var allianceStat = alliances[player.alliance];
            var factionAllianceStat = factionAlliances[player.faction + player.agenda];

            if(player.name === game.winner) {
                playerStat.wins++;
                factionStat.wins++;
                allianceStat.wins++;
                factionAllianceStat.wins++;
            } else {
                playerStat.losses++;
                factionStat.losses++;
                allianceStat.losses++;
                factionAllianceStat.losses++;
            }
        });
    });

    let winners = Object.values(players)
        .sort((a, b) => b.wins - a.wins)
        .slice(0, 10);

    let winRates = winners.map((player) => {
        let totalGames = player.wins + player.losses;

        return {
            name: player.name,
            wins: player.wins,
            losses: player.losses,
            winRate: Math.round((player.wins / totalGames) * 100)
        };
    });

    let winRateStats = [...winRates]
        .sort((a, b) => b.winRate - a.winRate)
        .slice(0, 10);

    let factionWinRates = Object.values(factions).map((faction) => {
        let totalGames = faction.wins + faction.losses;

        return {
            name: faction.name,
            wins: faction.wins,
            losses: faction.losses,
            winRate: Math.round((faction.wins / totalGames) * 100)
        };
    });

    let factionWinRateStats = [...factionWinRates].sort((a, b) => b.winRate - a.winRate);

    let factionAllianceWinners = Object.values(factionAlliances)
        .sort((a, b) => b.wins - a.wins)
        .slice(0, 10);

    let factionAllianceWinRates = factionAllianceWinners.map((faction) => {
        let totalGames = faction.wins + faction.losses;

        return {
            name: faction.name,
            wins: faction.wins,
            losses: faction.losses,
            winRate: Math.round((faction.wins / totalGames) * 100)
        };
    });

    let factionAllianceWinRateStats = [...factionAllianceWinRates]
        .sort((a, b) => b.winRate - a.winRate)
        .slice(0, 10);

    console.info('### Top 10\n\nName | Number of wins\n----|----------------');

    winners.forEach((winner) => {
        console.info(winner.name, ' | ', winner.wins);
    });

    console.info(
        '### Top 10 by winrate\n\nName | Number of wins | Number of losses | Win Rate\n----|-------------|------------------|--------'
    );

    winRateStats.forEach((winner) => {
        console.info(winner.name, ' | ', winner.wins, ' | ', winner.losses, ' | ', winner.winRate + '%');
    });

    console.info(
        '### Faction win rates\n\nFaction | Number of wins | Number of losses | Win Rate\n----|-------------|------------------|--------'
    );

    factionWinRateStats.forEach((winner) => {
        console.info(winner.name, ' | ', winner.wins, ' | ', winner.losses, ' | ', winner.winRate + '%');
    });

    console.info(
        '### Faction/Alliance combination win rates\n\nFaction/Alliance | Number of wins | Number of losses | Win Rate\n----|-------------|------------------|--------'
    );

    factionAllianceWinRateStats.forEach((winner) => {
        console.info(winner.name, ' | ', winner.wins, ' | ', winner.losses, ' | ', winner.winRate + '%');
    });

    console.info(rejected);
}

runStats()
    .then(() => db.close())
    .catch(err => {
        console.error('Error running stats:', err);
        db.close();
    });
