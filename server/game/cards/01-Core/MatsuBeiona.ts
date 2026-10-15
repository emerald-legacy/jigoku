import { Trait } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

class MatsuBeiona extends DrawCard {
    static id = 'matsu-beiona';

    override setupCardAbilities() {
        this.reaction('Put 2 fate on this character')
            .when({
                onCharacterEntersPlay: (event, context) => (
                    event.card === context.source &&
                    context.player.cardsInPlay.filter((card) => (
                        card.hasTrait(Trait.Bushi) &&
                        card !== context.source
                    )).length >= 3
                )
            })
            .placeFate({ amount: 2 });
    }
}


export default MatsuBeiona;
