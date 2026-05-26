import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityTypes, CardTypes, EventNames } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class Chikara extends DrawCard {
    static id = 'chikara';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            unique: true,
            faction: 'crab'
        });

        this.grantedAbilityLimits = {};
        this.whileAttached({
            match: (card: any) => card.hasTrait('champion'),
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Reaction, {
                title: 'Return all fate from, then sacrifice a character',
                when: {
                    afterConflict: (event: EventPayload<EventNames.AfterConflict>, context: any) => {
                        return event.conflict.winner === context.source.controller && context.source.isParticipating();
                    }
                },
                printedAbility: false,
                effect: 'force {1} to sacrifice {0}, returning all its fate to {1}\'s fate pool',
                effectArgs: (context: any) => [context.target.controller],
                target: {
                    cardType: CardTypes.Character,
                    cardCondition: (card: any) => card.isParticipating(),
                    gameAction: AbilityDsl.actions.sequential([
                        AbilityDsl.actions.removeFate((context: any) => ({
                            amount: context.target.getFate(),
                            recipient: context.target.owner
                        })),
                        AbilityDsl.actions.sacrifice((context: any) => ({
                            target: context.target
                        }))
                    ])
                }
            })
        });
    }
}


export default Chikara;
