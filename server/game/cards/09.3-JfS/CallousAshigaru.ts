import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { ConflictTypes, EventNames, Locations } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class CallousAshigaru extends DrawCard {
    static id = 'callous-ashigaru';

    setupCardAbilities() {
        this.attachmentConditions({
            unique: true
        });

        this.reaction({
            title: 'Discard cards from provinces',
            when: {
                onBreakProvince: (event: EventPayload<EventNames.OnBreakProvince>, context) => event.conflict?.conflictType === ConflictTypes.Military &&
                    !!context.source.parent && context.source.parent.isAttacking()
            },
            gameAction: AbilityDsl.actions.discardCard(context => ({
                target: context.player.opponent ?
                    context.player.opponent.getDynastyCardsInProvince(Locations.Provinces) :
                    []
            }))
        });
    }
}


export default CallousAshigaru;

