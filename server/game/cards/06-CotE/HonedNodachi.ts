import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType, EventName, Players } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class HonedNodachi extends DrawCard {
    static id = 'honed-nodachi';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.attachmentConditions({
            trait: 'bushi'
        });

        this.reaction({
            title: 'Remove a fate from attached character and force opponent to discard a participating character',
            when: {
                afterConflict: (event: EventPayload<EventName.AfterConflict>, context: any) => context.source.parent && context.source.parent.isParticipating() &&
                                                   event.conflict.winner === context.source.parent.controller &&
                                                   event.conflict.conflictType === 'military'
            },
            cost: ability.costs.removeFateFromParent(),
            target: {
                activePromptTitle: 'Choose a character to discard',
                cardType: CardType.Character,
                player: Players.Opponent,
                controller: Players.Opponent,
                cardCondition: (card: any) => card.isParticipating(),
                gameAction: ability.actions.discardFromPlay()
            }
        });
    }
}


export default HonedNodachi;
