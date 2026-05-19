import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class IkomaKiyono extends DrawCard {
    static id = 'ikoma-kiyono';

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


export default IkomaKiyono;

