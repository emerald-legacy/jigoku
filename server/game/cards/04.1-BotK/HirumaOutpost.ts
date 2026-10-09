import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { gainAbility } from '../../effects.js';

class HirumaOutpost extends DrawCard {
    static id = 'hiruma-outpost';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => {
                const province = context.player.getProvinceCardInProvince(context.source.location);
                return !!province && !province.isBroken;
            },
            effect: gainAbility.reaction('Make opponent lose an honor', {
                onConflictDeclared: (event, context) => {
                    if(event.conflict.attackingPlayer === context.player) {
                        return false;
                    }
                    if(!event.conflict.declaredProvince) {
                        return false;
                    }
                    const cards = context.player.getDynastyCardsInProvince(event.conflict.declaredProvince.location);
                    return !cards.some((card) => card.isFaceup() && card.type === CardType.Holding);
                }
            }, (ability) => ability.loseHonor((context) => ({ target: context.player.opponent })))
        });
    }
}


export default HirumaOutpost;
