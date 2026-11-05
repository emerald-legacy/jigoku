import { CardType, Trait } from '../../../Constants.js';
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
            .getCharacters(player)
            .filter((card) => card.hasTrait(Trait.Cavalry))
            .map((x) => x.glory)
    );
}

export default class UtakuStableMaster extends DrawCard {
    static id = 'utaku-stable-master';

    override setupCardAbilities() {
        this.conflictAction('Bow a participating character with equal or lower glory than a Cavalry on your side', { evenFromHome: true })
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card.isParticipating() &&
                    card.glory <= participatingCavGlory(context.game.requireConflict(), context.player)
            }, bow());
    }
}
