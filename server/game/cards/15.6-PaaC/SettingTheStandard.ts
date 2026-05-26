import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityTypes, EventNames } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class SettingTheStandard extends DrawCard {
    static id = 'setting-the-standard';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Reaction, {
                title: 'Draw 2 cards and discard one',
                when: {
                    afterConflict: (event: EventPayload<EventNames.AfterConflict>, context: any) =>
                        event.conflict.winner === context.source.controller && context.source.isParticipating()
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
