import DrawCard from '../../DrawCard.js';
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
                onCardRevealed: (event, context) => context.source.attachedCharacter && event.card.isProvince && event.card.controller === context.source.attachedCharacter.controller
            },
            gameAction: AbilityDsl.actions.ready(context => ({ target: context.source.attachedCharacter }))
        });
    }
}


export default WaterfallTattoo;
