import { CardType } from '../../../Constants.js';
import { modifyGlory } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';
import type Player from '../../../Player.js';

function holdingsControlledBy(player: Player): number {
    return player.game.allCards.filter((card) =>
        card.type === CardType.Holding && card.controller === player && card.isFaceup() && card.isInProvince()
    ).length;
}

export default class ProtectedMerchant extends DrawCard {
    static id = 'protected-merchant';

    public override setupCardAbilities() {
        this.persistentEffect({
            effect: modifyGlory((card) => Math.min(2, holdingsControlledBy(card.controller)))
        });
    }
}
