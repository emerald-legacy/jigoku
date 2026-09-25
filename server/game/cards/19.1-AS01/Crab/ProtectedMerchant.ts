import { CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class ProtectedMerchant extends DrawCard {
    static id = 'protected-merchant';

    public setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.modifyGlory(() => Math.min(2, this.getHoldingsInPlay()))
        });
    }

    private getHoldingsInPlay(): number {
        return (this.game.allCards).reduce(
            (sum, card) =>
                card.type === CardType.Holding &&
                card.controller === this.controller &&
                card.isFaceup() &&
                card.isInProvince()
                    ? sum + 1
                    : sum,
            0
        );
    }
}
