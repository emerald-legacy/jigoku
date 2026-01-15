const db = require('../db.js');
const UserService = require('../services/UserService.js');
const { logger } = require('../logger');

module.exports.init = function (server) {
    const userService = new UserService(db.getDb());

    server.get('/api/user/:username', async function (req, res) {
        if(!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        if(!req.user.permissions || !req.user.permissions.canManageUsers) {
            return res.status(403).send({ message: 'Forbidden' });
        }

        try {
            const user = await userService.getUserByUsername(req.params.username);

            if(!user) {
                return res.status(404).send({ message: 'Not found' });
            }

            res.send({ success: true, user: user });
        } catch(err) {
            logger.error(err);
            res.status(500).send({ success: false, message: 'Error fetching user' });
        }
    });

    server.put('/api/user/:username', async function (req, res) {
        if(!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        if(!req.user.permissions || !req.user.permissions.canManageUsers) {
            return res.status(403).send({ message: 'Forbidden' });
        }

        try {
            const userToSet = JSON.parse(req.body.data);
            const user = await userService.getUserByUsername(req.params.username);

            if(!user) {
                return res.status(404).send({ message: 'Not found' });
            }

            user.permissions = userToSet.permissions;
            await userService.update(user);

            res.send({ success: true });
        } catch(err) {
            logger.error(err);
            res.send({ success: false, message: 'An error occured saving the user' });
        }
    });
};
