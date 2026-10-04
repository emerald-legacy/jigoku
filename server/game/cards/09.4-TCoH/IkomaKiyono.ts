import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class IkomaKiyono extends DrawCard {
    static id = 'ikoma-kiyono';

    setupCardAbilities() {
        this.wouldInterrupt('Ready for Glory Count')
            .when({
                onGloryCount: (event, context) => {
                    return context.player.isMoreHonorable();
                }
            })
            .gameAction(AbilityDsl.actions.ready());
    }
}


export default IkomaKiyono;

