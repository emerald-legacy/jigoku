import AbilityDsl from '../../../abilitydsl.js';
import { CardTypes, Durations, EventNames } from '../../../Constants.js';
import DrawCard from '../../../drawcard.js';
import { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import type { EventPayload } from '../../../Events/EventPayloads.js';

type SendOrReturnHomeEvent =
    | EventPayload<EventNames.OnSendHome>
    | EventPayload<EventNames.OnReturnHome>;

export default class LongJourneyHome extends DrawCard {
    static id = 'long-journey-home';

    setupCardAbilities() {
        this.reaction({
            title: 'Bow a character for the phase',
            when: {
                onSendHome: (event, context) => this.affectedOpponentsCharacter(event, context),
                onReturnHome: (event, context) => this.affectedOpponentsCharacter(event, context)
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card === context.event.card,
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.bow(),
                    AbilityDsl.actions.cardLastingEffect({
                        duration: Durations.UntilEndOfPhase,
                        effect: AbilityDsl.effects.cardCannot({ cannot: 'ready' })
                    })
                ])
            },
            effect: 'make {1} take the long way home. {1} is bowed and cannot ready until the end of the phase',
            effectArgs: (context) => [context.event.card]
        });
    }

    private affectedOpponentsCharacter(event: SendOrReturnHomeEvent, context: TriggeredAbilityContext<this>) {
        return !!event.card && event.card.type === CardTypes.Character && event.card.controller === context.source.controller.opponent;
    }
}
