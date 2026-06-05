import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { AbilityType, CardType, EventName } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class HirumaOutpost extends DrawCard {
    static id = 'hiruma-outpost';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context: AbilityContext) => {
                const province = context.player.getProvinceCardInProvince(context.source.location);
                return !!province && !province.isBroken;
            },
            effect: AbilityDsl.effects.gainAbility(AbilityType.Reaction, {
                title: 'Make opponent lose an honor',
                when: {
                    onConflictDeclared: (event: EventPayload<EventName.OnConflictDeclared>, context: AbilityContext) => {
                        if(event.conflict.attackingPlayer === context.player) {
                            return false;
                        }
                        if(!event.conflict.declaredProvince) {
                            return false;
                        }
                        let cards = context.player.getDynastyCardsInProvince(event.conflict.declaredProvince.location);
                        return !cards.some(card => card.isFaceup() && card.type === CardType.Holding);
                    }
                },
                gameAction: AbilityDsl.actions.loseHonor()
            })
        });
    }
}


export default HirumaOutpost;
