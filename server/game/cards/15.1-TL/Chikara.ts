import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityType, CardType, EventName } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class Chikara extends DrawCard {
    static id = 'chikara';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            unique: true,
            faction: 'crab'
        });

        this.whileAttached({
            match: (card: any) => card.hasTrait('champion'),
            effect: AbilityDsl.effects.gainAbility(AbilityType.Reaction, {
                title: 'Return all fate from, then sacrifice a character',
                when: {
                    afterConflict: (event: EventPayload<EventName.AfterConflict>, context: any) => {
                        return event.conflict.winner === context.source.controller && context.source.isParticipating();
                    }
                },
                printedAbility: false,
                effect: 'force {1} to sacrifice {0}, returning all its fate to {1}\'s fate pool',
                effectArgs: (context: AbilityContext) => [(context.target as DrawCard).controller],
                target: {
                    cardType: CardType.Character,
                    cardCondition: (card: any) => card.isParticipating(),
                    gameAction: AbilityDsl.actions.sequential([
                        AbilityDsl.actions.removeFate((context: AbilityContext) => ({
                            amount: (context.target as DrawCard).getFate(),
                            recipient: (context.target as DrawCard).owner
                        })),
                        AbilityDsl.actions.sacrifice((context: AbilityContext) => ({
                            target: context.target
                        }))
                    ])
                }
            })
        });
    }
}


export default Chikara;
