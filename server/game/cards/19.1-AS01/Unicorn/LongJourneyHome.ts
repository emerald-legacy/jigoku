import { msg } from '../../../GameChat.js';
import { cardCannot } from '../../../effects.js';
import { bow, cardLastingEffect, multiple } from '../../../GameActions/GameActions.js';
import { CardType, Duration, EventName, RestrictionType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import type { EventPayload } from '../../../Events/EventPayloads.js';

type SendOrReturnHomeEvent =
    | EventPayload<EventName.OnSendHome>
    | EventPayload<EventName.OnReturnHome>;

export default class LongJourneyHome extends DrawCard {
    static id = 'long-journey-home';

    setupCardAbilities() {
        this.reaction('Bow a character for the phase')
            .when({
                onSendHome: (event, context) => this.affectedOpponentsCharacter(event, context),
                onReturnHome: (event, context) => this.affectedOpponentsCharacter(event, context)
            })
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) => card === context.event.card
            }, multiple([
                bow(),
                cardLastingEffect({
                    duration: Duration.UntilEndOfPhase,
                    effect: cardCannot({ cannot: RestrictionType.Ready })
                })
            ]))
            .chatText((context) => msg`make ${context.event.card} take the long way home. ${context.event.card} is bowed and cannot ready until the end of the phase`);
    }

    private affectedOpponentsCharacter(event: SendOrReturnHomeEvent, context: TriggeredAbilityContext<this>) {
        return event.card.type === CardType.Character && event.card.controller === context.source.controller.opponent;
    }
}
