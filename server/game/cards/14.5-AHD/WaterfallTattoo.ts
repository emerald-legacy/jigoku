import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class WaterfallTattoo extends DrawCard {
    static id = 'waterfall-tattoo';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.whileAttached({
            effect: AbilityDsl.effects.addTrait('tattooed')
        });

        this.reaction({
            title: 'Ready attached character',
            when: {
                onCardRevealed: (event, context) => context.source.parent && event.card.isProvince && event.card.controller === context.source.parent.controller
            },
            gameAction: AbilityDsl.actions.ready(context => ({ target: context.source.parent }))
        });
    }
}


export default WaterfallTattoo;
