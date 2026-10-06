import DrawCard from '../../DrawCard.js';
import { AbilityType, CardType } from '../../Constants.js';
import { gainAbility } from '../../effects.js';
import { loseHonor } from '../../GameActions/GameActions.js';

class HirumaOutpost extends DrawCard {
    static id = 'hiruma-outpost';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => {
                const province = context.player.getProvinceCardInProvince(context.source.location);
                return !!province && !province.isBroken;
            },
            effect: gainAbility(AbilityType.Reaction, {
                title: 'Make opponent lose an honor',
                when: {
                    onConflictDeclared: (event, context) => {
                        if(event.conflict.attackingPlayer === context.player) {
                            return false;
                        }
                        if(!event.conflict.declaredProvince) {
                            return false;
                        }
                        const cards = context.player.getDynastyCardsInProvince(event.conflict.declaredProvince.location);
                        return !cards.some(card => card.isFaceup() && card.type === CardType.Holding);
                    }
                },
                gameAction: loseHonor()
            })
        });
    }
}


export default HirumaOutpost;
