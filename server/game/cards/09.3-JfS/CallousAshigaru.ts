import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { ConflictType, EventName, Location } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class CallousAshigaru extends DrawCard {
    static id = 'callous-ashigaru';

    setupCardAbilities() {
        this.attachmentConditions({
            unique: true
        });

        this.reaction('Discard cards from provinces')
            .when({
                onBreakProvince: (event: EventPayload<EventName.OnBreakProvince>, context) => event.conflict?.conflictType === ConflictType.Military &&
                    !!context.source.parentCharacter && context.source.parentCharacter.isAttacking()
            })
            .gameAction(AbilityDsl.actions.discardCard(context => ({
                target: context.player.opponent ?
                    context.player.opponent.getDynastyCardsInProvince(Location.Provinces) :
                    []
            })));
    }
}


export default CallousAshigaru;

