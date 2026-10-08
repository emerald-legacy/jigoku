import { CardType, PlayType, Players, TargetMode } from '../../../Constants.js';
import { delayedEffect, playerCannot } from '../../../effects.js';
import { multiple, placeFate, playerLastingEffect, selectCards } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class UtakuSumire extends DrawCard {
    static id = 'utaku-sumire';

    setupCardAbilities() {
        this.interrupt('Don\'t play cards. Place fate on up to 2 characters on win')
            .when({
                onConflictStarted: (_, context) => context.source.isAttacking()
            })
            .gameAction(multiple([
                playerLastingEffect({
                    targetController: Players.Self,
                    effect: playerCannot({
                        cannot: PlayType.PlayFromHand,
                        restricts: 'actionEvents'
                    })
                }),
                playerLastingEffect({
                    targetController: Players.Self,
                    effect: delayedEffect({
                        when: {
                            afterConflict: (event, context) => event.conflict.winner === context.player
                        },
                        gameAction: selectCards({
                            cardType: CardType.Character,
                            controller: Players.Self,
                            player: Players.Self,
                            mode: TargetMode.UpTo,
                            numCards: 2,
                            gameAction: placeFate(),
                            message: '{0} encourages her troops and places {1} on {2}',
                            messageArgs: (cards) => {
                                const named = cards.map((c) => (c === this ? 'herself' : c));
                                return [this, 'fate', named];
                            }
                        })
                    })
                })
            ]))
            .chatText('charge into battle under the devout silence of the Utaku - during this conflict, {1} refuses to play Action events. If they win the conflict, their warriors will have their confidence renewed', (context) => [context.player]);
    }
}
