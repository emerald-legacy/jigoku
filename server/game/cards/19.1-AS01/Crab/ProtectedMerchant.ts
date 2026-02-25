import { CardTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import BaseCard from '../../../basecard';
import DrawCard from '../../../drawcard';

export default class ProtectedMerchant extends DrawCard {
    static id = 'protected-merchant';

    public setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.modifyGlory(() => Math.min(2, this.getHoldingsInPlay()))
        });
    }

    private getHoldingsInPlay(): number {
        return (this.game.allCards as BaseCard[]).reduce(
            (sum, card) =>
                card.type === CardTypes.Holding &&
                card.controller === this.controller &&
                card.isFaceup() &&
                card.isInProvince()
                    ? sum + 1
                    : sum,
            0
        );
    }
}
