import { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Duration, EventName, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
export default class BayushiShinobu extends DrawCard {
    static id = 'bayushi-shinobu';

    public setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.delayedEffect({
                when: {
                    onCharacterEntersPlay: (event: EventPayload<EventName.OnCharacterEntersPlay>, context: AbilityContext) => event.card === context.source
                },
                gameAction: AbilityDsl.actions.handler({
                    handler: (context) => {
                        context.source.dishonor();
                    }
                }),
                duration: Duration.Persistent,
                multipleTrigger: true
            })
        });

        this.action({
            title: 'Take control of a character',
            cost: AbilityDsl.costs.bowSelf(),
            target: {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => !card.anotherUniqueInPlay(context.player) && card.isDishonored && !card.isUnique(),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.cardLastingEffect(context => ({
                        effect: AbilityDsl.effects.takeControl(context.player),
                        duration: Duration.UntilEndOfPhase
                    })),
                    AbilityDsl.actions.playerLastingEffect(context => ({
                        target: context.player,
                        effect: AbilityDsl.effects.delayedEffect({
                            when: {
                                onCardLeavesPlay: (event: EventPayload<EventName.OnCardLeavesPlay>) => event.card === context.target
                            },
                            onlyRemoveOnSuccess: true,
                            gameAction: AbilityDsl.actions.loseHonor(({
                                amount: 2,
                                target: context.player
                            })),
                            message: '{0} loses 2 honor due to the delayed effect of {1}',
                            messageArgs: [context.player, context.source]
                        }),
                        duration: Duration.UntilEndOfPhase
                    }))
                ])
            },
            effect: 'take control of {0}'
        });
    }
}


