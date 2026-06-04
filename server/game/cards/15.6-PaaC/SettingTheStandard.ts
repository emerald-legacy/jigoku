import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityType, EventName } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';
class SettingTheStandard extends DrawCard {
    static id = 'setting-the-standard';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityType.Reaction, {
                title: 'Draw 2 cards and discard one',
                when: {
                    afterConflict: (event: EventPayload<EventName.AfterConflict>, context: TriggeredAbilityContext) =>
                        event.conflict.winner === context.source.controller && (context.source as DrawCard).isParticipating()
                },
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.draw((context) => ({ target: context.player, amount: 2 })),
                    AbilityDsl.actions.chosenDiscard((context) => ({ target: context.player }))
                ]),
                effect: 'draw 2 cards, then discard 1'
            })
        });
    }
}


export default SettingTheStandard;
