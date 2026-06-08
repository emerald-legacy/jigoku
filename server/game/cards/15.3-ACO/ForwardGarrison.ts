import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType } from '../../Constants.js';

class ForwardGarrison extends DrawCard {
    static id = 'forward-garrison';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.game.isTraitInPlay('battlefield'),
            match: (card: DrawCard, context) => card.type === CardType.Character && card.controller === context?.player,
            effect: AbilityDsl.effects.cardCannot({
                cannot: 'removeFate',
                restricts: 'opponentsCardAndRingEffects'
            })
        });
    }
}


export default ForwardGarrison;
