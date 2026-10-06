import DrawCard from '../../DrawCard.js';
import { cardCannot } from '../../effects.js';
import { CardType } from '../../Constants.js';

class ForwardGarrison extends DrawCard {
    static id = 'forward-garrison';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.game.isTraitInPlay('battlefield'),
            match: (card, context) => card.type === CardType.Character && card.controller === context?.player,
            effect: cardCannot({
                cannot: 'removeFate',
                restricts: 'opponentsCardAndRingEffects'
            })
        });
    }
}


export default ForwardGarrison;
