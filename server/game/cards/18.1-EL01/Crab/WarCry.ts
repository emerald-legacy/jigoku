import { ConflictType, CardType, Location } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import type { Conflict } from '../../../Conflict.js';
import DrawCard from '../../../DrawCard.js';

function areAllAttackersBerserker(conflict: Conflict) {
    return conflict.attackers.every((c) => c.hasTrait('berserker'));
}

export default class WarCry extends DrawCard {
    static id = 'war-cry';

    setupCardAbilities() {
        this.reaction({
            title: 'Break the attacked province',
            when: {
                afterConflict: (event, context) =>
                    event.conflict.winner === context.player &&
                    event.conflict.attackingPlayer === context.player &&
                    event.conflict.conflictType === ConflictType.Military &&
                    !(context.game.currentConflict as Conflict).isAtStrongholdProvince() &&
                    areAllAttackersBerserker(event.conflict)
            },
            effect: 'break an attacked province',
            gameAction: AbilityDsl.actions.selectCard((context) => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) => card.isConflictProvince() && card.location !== Location.StrongholdProvince,
                message: '{0} breaks {1}',
                messageArgs: (cards) => [context.player, cards],
                gameAction: AbilityDsl.actions.breakProvince()
            }))
        });
    }
}
