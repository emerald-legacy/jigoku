const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class IkomaKiyono extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Ready for Glory Count',
            when: {
                onGloryCount: (event, context) => {
                    return context.player && context.player.opponent && context.player.isMoreHonorable();
                }
            },
            gameAction: AbilityDsl.actions.ready()
        });
    }
}

IkomaKiyono.id = 'ikoma-kiyono';

module.exports = IkomaKiyono;

