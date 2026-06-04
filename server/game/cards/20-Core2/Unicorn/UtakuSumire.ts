import { CardType, Duration, EventName, PlayType, Players, TargetMode } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
import type { AbilityContext } from '../../../AbilityContext.js';
export default class UtakuSumire extends DrawCard {
    static id = 'utaku-sumire';

    setupCardAbilities() {
        this.interrupt({
            title: 'Don\'t play cards. Place fate on up to 2 characters on win',
            when: {
                onConflictStarted: (_, context) => context.source.isAttacking()
            },
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.playerLastingEffect({
                    targetController: Players.Self,
                    effect: AbilityDsl.effects.playerCannot({
                        cannot: PlayType.PlayFromHand,
                        restricts: 'actionEvents'
                    })
                }),
                AbilityDsl.actions.playerLastingEffect({
                    duration: Duration.UntilEndOfConflict,
                    targetController: Players.Self,
                    effect: AbilityDsl.effects.delayedEffect({
                        when: {
                            afterConflict: (event: EventPayload<EventName.AfterConflict>, context: AbilityContext) => event.conflict.winner === context.player
                        },
                        gameAction: AbilityDsl.actions.selectCard({
                            cardType: CardType.Character,
                            controller: Players.Self,
                            player: Players.Self,
                            mode: TargetMode.UpTo,
                            numCards: 2,
                            gameAction: AbilityDsl.actions.placeFate(),
                            message: '{0} encourages her troops and places {1} on {2}',
                            messageArgs: (cards) => {
                                const targets = Array.isArray(cards) ? cards : [cards];
                                const named = targets.map((c) => (c === this ? 'herself' : c));
                                return [this, 'fate', named];
                            }
                        })
                    })
                })
            ]),
            effect: 'charge into battle under the devout silence of the Utaku - during this conflict, {1} refuses to play Action events. If they win the conflict, their warriors will have their confidence renewed!',
            effectArgs: (context) => [context.player]
        });
    }
}
