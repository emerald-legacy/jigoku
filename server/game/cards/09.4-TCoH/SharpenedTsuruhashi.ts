import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class SharpenedTsuruhashi extends DrawCard {
    static id = 'sharpened-tsuruhashi';

    setupCardAbilities() {
        this.interrupt({
            title: 'Return Sharpened Tsuruhashi to your hand',
            when: {
                onCardLeavesPlay: (event: any, context) => event.isSacrifice && event.card === context.source.parent
            },
            gameAction: AbilityDsl.actions.returnToHand(context => ({
                target: context.source
            })),
            effect: 'return it to their hand.'
        });
    }
}


export default SharpenedTsuruhashi;

