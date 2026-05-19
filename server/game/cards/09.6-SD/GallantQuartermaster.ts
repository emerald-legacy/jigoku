import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class GallantQuartermaster extends DrawCard {
    static id = 'gallant-quartermaster';

    setupCardAbilities() {
        this.interrupt({
            title: 'Gain two fate',
            when: {
                onCardLeavesPlay: (event, context) => event.isSacrifice && event.card === context.source
            },
            gameAction: AbilityDsl.actions.gainFate({ amount: 2 })
        });
    }
}


export default GallantQuartermaster;
