import DrawCard from '../../drawcard.js';
import { CardTypes, AbilityTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class HirumaOutpost extends DrawCard {
    static id = 'hiruma-outpost';

    setupCardAbilities() {
        this.grantedAbilityLimits = {};
        this.persistentEffect({
            condition: context => !context.player.getProvinceCardInProvince(context.source.location).isBroken,
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Reaction, {
                title: 'Make opponent lose an honor',
                when: {
                    onConflictDeclared: (event, context) => {
                        if(event.conflict.attackingPlayer === context.player) {
                            return false;
                        }
                        let cards = context.player.getDynastyCardsInProvince(event.conflict.declaredProvince.location);
                        return !cards.some(card => card.isFaceup() && card.type === CardTypes.Holding);
                    }
                },
                gameAction: AbilityDsl.actions.loseHonor()
            })
        });
    }

    leavesPlay() {
        this.grantedAbilityLimits = {};
        super.leavesPlay();
    }
}


export default HirumaOutpost;
