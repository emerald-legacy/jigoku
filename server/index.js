const Server = require('./server.js');
const Lobby = require('./lobby.js');
const pmx = require('pmx');
const db = require('./db.js');
const env = require('./env.js');

async function runServer() {
    // Connect to database first
    const database = await db.connect(env.dbPath);

    var server = new Server(process.env.NODE_ENV !== 'production');
    server.initDb();
    var httpServer = server.init();
    var lobby = new Lobby(httpServer, { db: database });

    pmx.action('status', (reply) => {
        var status = lobby.getStatus();

        reply(status);
    });

    pmx.action('disable', (param, reply) => {
        if(!param) {
            reply({ error: 'Need to specify node to disable' });

            return;
        }

        reply({ success: lobby.disableNode(param) });
    });

    pmx.action('enable', (param, reply) => {
        if(!param) {
            reply({ error: 'Need to specify node to enable' });

            return;
        }

        reply({ success: lobby.enableNode(param) });
    });

    pmx.action('debug', (reply) => {
        reply(lobby.debugDump());
    });

    server.run();
}

module.exports = runServer;
