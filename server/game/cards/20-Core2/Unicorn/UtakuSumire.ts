import { CardTypes, Durations, PlayTypes, Players, TargetModes } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

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
                        cannot: PlayTypes.PlayFromHand,
                        restricts: 'actionEvents'
                    })
                }),
                AbilityDsl.actions.playerLastingEffect({
                    duration: Durations.UntilEndOfConflict,
                    targetController: Players.Self,
                    effect: AbilityDsl.effects.delayedEffect({
                        when: {
                            afterConflict: (event: any, context: any) => event.conflict.winner === context.player
                        },
                        gameAction: AbilityDsl.actions.selectCard({
                            cardType: CardTypes.Character,
                            controller: Players.Self,
                            player: Players.Self,
                            mode: TargetModes.UpTo,
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
