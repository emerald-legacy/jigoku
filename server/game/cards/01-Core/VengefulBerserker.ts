import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType, EventName, Location } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class VengefulBerserker extends DrawCard {
    static id = 'vengeful-berserker';

    setupCardAbilities() {
        this.reaction('Double military skill')
            .when({
                onCardLeavesPlay: (event: EventPayload<EventName.OnCardLeavesPlay>, context) => {
                    const card = event.cardStateWhenLeftPlay;
                    return !!card && card.location === Location.PlayArea && card.type === CardType.Character && card.controller === context.player && this.game.isDuringConflict();
                }
            })
            .gameAction(AbilityDsl.actions.cardLastingEffect({ effect: AbilityDsl.effects.modifyMilitarySkillMultiplier(2) }))
            .effect('double his military skill until the end of the conflict');
    }
}


export default VengefulBerserker;
