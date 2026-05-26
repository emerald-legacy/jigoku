import AbilityDsl from '../../../abilitydsl.js';
import { AbilityTypes, CardTypes, EventNames } from '../../../Constants.js';
import DrawCard from '../../../drawcard.js';
import type { TriggeredAbilityProps } from '../../../Interfaces.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
export default class Naginata extends DrawCard {
    static id = 'naginata';

    setupCardAbilities() {
        this.attachmentConditions({ myControl: true });

        this.whileAttached({
            condition: (context) => !!context.source.parent && context.source.controller.firstPlayer,
            effect: AbilityDsl.effects.modifyMilitarySkill(1)
        });

        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Reaction, {
                title: 'Bow a character',
                when: {
                    onMoveToConflict: (event: EventPayload<EventNames.OnMoveToConflict>, context: TriggeredAbilityContext<DrawCard>) =>
                        context.source.isParticipating('military') &&
                        event.card?.type === CardTypes.Character &&
                        event.card?.isParticipating(),
                    onSendHome: (event: EventPayload<EventNames.OnSendHome>, context: TriggeredAbilityContext<DrawCard>) =>
                        context.source.isParticipating('military') &&
                        event.card?.type === CardTypes.Character &&
                        !event.card?.isParticipating()
                },
                target: {
                    cardType: CardTypes.Character,
                    cardCondition: (card, context) =>
                        card.isParticipating() && card.getMilitarySkill() < context.source.getMilitarySkill(),
                    gameAction: AbilityDsl.actions.bow()
                }
            } as TriggeredAbilityProps)
        });
    }
}
