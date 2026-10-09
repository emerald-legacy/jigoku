import DrawCard from '../../../DrawCard.js';
import { Players, CardType, ConflictType } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { bow } from '../../../GameActions/GameActions.js';

class Spearhead extends DrawCard {
    static id = 'spearhead';

    setupCardAbilities() {
        this.action('Bow a character')
            .cost(costs.sacrifice({
                cardType: CardType.Attachment,
                // `parentCharacter` is null when attached to a province or ring, which does not participate.
                cardCondition: (card, context) => !!card.parentCharacter &&
                    card.parentCharacter.controller === context.player && card.parentCharacter.isParticipating()
            }))
            .condition((context) => context.game.isDuringConflict(ConflictType.Military))
            .target({
                player: Players.Opponent,
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, bow())
            .cannotTargetFirst();
    }
}


export default Spearhead;
