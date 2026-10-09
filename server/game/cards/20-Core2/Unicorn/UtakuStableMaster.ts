import { CardType } from '../../../Constants.js';
import { bow } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import type { Conflict } from '../../../Conflict.js';
import type Player from '../../../Player.js';

/**
 * Returns -1 in case there are no cavalry characters
 */
function participatingCavGlory(conflict: Conflict, player: Player): number {
    return Math.max(
        -1,
        ...conflict
            .getParticipants((card) => card.controller === player && card.hasTrait('cavalry'))
            .map((x) => x.glory)
    );
}

export default class UtakuStableMaster extends DrawCard {
    static id = 'utaku-stable-master';

    setupCardAbilities() {
        this.conflictAction('Bow participating character with lower glory than participating cavalry', { evenFromHome: true })
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card.isParticipating() &&
                    card.glory <= participatingCavGlory(context.game.requireConflict(), context.player)
            }, bow());
    }
}
