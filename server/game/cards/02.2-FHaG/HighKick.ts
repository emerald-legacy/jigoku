import DrawCard from '../../DrawCard.js';
import { Players, CardType, ConflictType, Trait } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { cannotTriggerAbilities } from '../../effects.js';
import { bow, cardLastingEffect } from '../../GameActions/GameActions.js';

class HighKick extends DrawCard {
    static id = 'high-kick';

    override setupCardAbilities() {
        this.action('Bow and Disable a character')
            .condition(() => this.game.isDuringConflict(ConflictType.Military))
            .cost(costs.bow({
                cardType: CardType.Character,
                cardCondition: (card) => card.hasTrait(Trait.Monk) && card.isParticipating()
            }))
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, bow(), cardLastingEffect({ effect: cannotTriggerAbilities() }))
            .chatText('bow {0} and prevent them from using abilities');
    }
}


export default HighKick;
