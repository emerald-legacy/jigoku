import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { CardType, ConflictType } from '../../Constants.js';
import { addKeyword } from '../../effects.js';

class SubterraneanGuile extends DrawCard {
    static id = 'subterranean-guile';

    setupCardAbilities() {
        this.whileAttached({
            condition: (context) => this.game.isDuringConflict(ConflictType.Military) && this.isHoldingOnUnbrokenProvince(context),
            effect: addKeyword('covert')
        });
    }

    private isHoldingOnUnbrokenProvince(context: AbilityContext) {
        return context.game.getProvinceArray().some((location) => {
            const province = context.player.getProvinceCardInProvince(location);
            if(province && !province.isBroken) {
                const cards = context.player.getDynastyCardsInProvince(location);
                if(cards.some((card) => card.isFaceup() && card.type === CardType.Holding)) {
                    return true;
                }
            }
            return false;
        });
    }
}


export default SubterraneanGuile;
