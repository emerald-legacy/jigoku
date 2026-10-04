import DrawCard from '../../DrawCard.js';
import { Players, CardType, ConflictType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class HighKick extends DrawCard {
    static id = 'high-kick';

    setupCardAbilities() {
        this.action('Bow and Disable a character')
            .cost(AbilityDsl.costs.bow({
                cardType: CardType.Character,
                cardCondition: card => card.hasTrait('monk') && card.isParticipating()
            }))
            .condition(() => this.game.isDuringConflict(ConflictType.Military))
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating()
            }, AbilityDsl.actions.bow(), AbilityDsl.actions.cardLastingEffect({ effect: AbilityDsl.effects.cannotTriggerAbilities() }))
            .effect('bow {0} and prevent them from using abilities');
    }
}


export default HighKick;
