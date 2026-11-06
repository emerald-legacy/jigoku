import { Trait } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { addTrait } from '../../effects.js';

class WaterfallTattoo extends DrawCard {
    static id = 'waterfall-tattoo';

    override setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.whileAttached({
            effect: addTrait(Trait.Tattooed)
        });

        this.reaction('Ready attached character')
            .when({
                onCardRevealed: (event, context) => !!context.source.parentCharacter && event.card.isProvince && event.card.controller === context.player
            })
            .ready((context) => ({ target: context.source.parentCharacter ?? [] }));
    }
}


export default WaterfallTattoo;
