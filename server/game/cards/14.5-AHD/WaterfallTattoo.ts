import DrawCard from '../../DrawCard.js';
import { addTrait } from '../../effects.js';

class WaterfallTattoo extends DrawCard {
    static id = 'waterfall-tattoo';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.whileAttached({
            effect: addTrait('tattooed')
        });

        this.reaction('Ready attached character')
            .when({
                onCardRevealed: (event, context) => context.source.parentCharacter && event.card.isProvince && event.card.controller === context.source.parentCharacter.controller
            })
            .ready(context => ({ target: context.source.parentCharacter ?? [] }));
    }
}


export default WaterfallTattoo;
