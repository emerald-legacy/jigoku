import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { CardType, Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class SubterraneanGuile extends DrawCard {
    static id = 'subterranean-guile';

    setupCardAbilities() {
        this.whileAttached({
            condition: context => this.game.isDuringConflict('military') && this.isHoldingOnUnbrokenProvince(context),
            effect: AbilityDsl.effects.addKeyword('covert')
        });
    }

    isHoldingOnUnbrokenProvince(context: AbilityContext) {
        return context.game.getProvinceArray().some((location: Location) => {
            const province = context.player.getProvinceCardInProvince(location);
            if(province && !province.isBroken) {
                let cards = context.player.getDynastyCardsInProvince(location);
                if(cards.some(card => card.isFaceup() && card.type === CardType.Holding)) {
                    return true;
                }
            }
            return false;
        });
    }
}


export default SubterraneanGuile;
