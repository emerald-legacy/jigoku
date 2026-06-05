import { CardType, Duration, EventName, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type BaseCard from '../../../BaseCard.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import type { AbilityContext } from '../../../AbilityContext.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
export default class SupportingCast extends DrawCard {
    static id = 'supporting-cast';

    setupCardAbilities() {
        this.reaction({
            when: {
                onInitiateAbilityEffects: (event: EventPayload<EventName.OnInitiateAbilityEffects>, context) => {
                    return (
                        context.game.isDuringConflict('military') &&
                        (event.cardTargets ?? []).some((card: BaseCard) => card.controller === context.player)
                    );
                }
            },
            title: 'Give +3 military to a character',
            target: {
                activePromptTitle: 'Choose a character to give +3 military skill',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card: DrawCard, context?: TriggeredAbilityContext) =>
                    card.isParticipating() &&
                    !((context as TriggeredAbilityContext).event.cardTargets as BaseCard[]).some((eventCard: BaseCard) => eventCard === card),
                gameAction: [
                    AbilityDsl.actions.selectCard((context) => ({
                        activePromptTitle: 'Choose a character to bow',
                        hidePromptIfSingleCard: true,
                        cardCondition: (card, context: AbilityContext) =>
                            ((context as TriggeredAbilityContext).event.cardTargets as BaseCard[]).some((eventCard: BaseCard) => eventCard === card),
                        subActionProperties: (card) => {
                            context.target = card;
                            return { target: card };
                        },
                        gameAction: AbilityDsl.actions.bow()
                    })),
                    AbilityDsl.actions.cardLastingEffect({
                        duration: Duration.UntilEndOfConflict,
                        effect: AbilityDsl.effects.modifyMilitarySkill(3)
                    })
                ]
            },
            effect: 'give +3 military skill to {1} - {2} was just a distraction!',
            effectArgs: (context) => [context.target ?? '', context.event.cardTargets ?? []],
            max: AbilityDsl.limit.perConflict(1)
        });
    }
}
