import DrawCard from '../../drawcard.js';
import { CardTypes, EventNames } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class ThirdTower extends DrawCard {
    static id = 'third-tower';

    setupCardAbilities() {
        this.grantedAbilityLimits = {};
        this.reaction({
            title: 'Take an honor from your opponent',
            when: {
                onConflictDeclared: (event: EventPayload<EventNames.OnConflictDeclared>, context) => {
                    if(event.conflict.attackingPlayer === context.player) {
                        return false;
                    }
                    if(!event.conflict.declaredProvince) {
                        return false;
                    }
                    let cards = context.player.getDynastyCardsInProvince(event.conflict.declaredProvince.location);
                    return !cards.some((card: any) => card.isFaceup() && card.type === CardTypes.Holding && card.hasTrait('kaiu-wall'));
                }
            },
            gameAction: AbilityDsl.actions.takeHonor(),
            limit: AbilityDsl.limit.unlimitedPerConflict()
        });
    }
}


export default ThirdTower;
