import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType, Duration, Players } from '../../../Constants.js';
import { Direction } from '../../../GameActions/ModifyBidAction.js';
import { perConflict } from '../../../AbilityLimit.js';
import { additionalAction, delayedEffect, modifyBothSkills } from '../../../effects.js';
import { cardLastingEffect, modifyBid, playerLastingEffect, sequential } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class KakitaTechnique extends DrawCard {
    static id = 'kakita-technique';

    setupCardAbilities() {
        this.duelFocus('Set bid to 0')
            .gameAction(modifyBid((context) => {
                const currentBid = context.player.honorBid;
                return {
                    amount: currentBid,
                    direction: Direction.Decrease
                };
            }));

        this.action('Give character +1/+1')
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating() && (card.hasTrait('bushi') || card.hasTrait('duelist'))
            }, sequential([
                cardLastingEffect((context) => ({
                    effect: delayedEffect({
                        when: {
                            onCardPlayed: (event, context) =>
                                event.player === context.player && event.card.type === CardType.Event
                        },
                        message: '{0} gets +1{1} and +1{2} due to the delayed effect of {3}',
                        messageArgs: () => [context.target, 'military', 'political', context.source],
                        multipleTrigger: true,
                        gameAction: cardLastingEffect({
                            target: context.target,
                            effect: modifyBothSkills(1)
                        })
                    })
                })),
                playerLastingEffect((context) => ({
                    targetController: context.player,
                    duration: Duration.UntilPassPriority,
                    effect: additionalAction(this.getExtraActionCount(context))
                }))
            ]))
            .chatText('give {0} +1{1} and +1{2} after each event they play{3}{4}{5}{6}', (context) => {
                const actions = this.getExtraActionCount(context);
                if(actions > 0) {
                    return [
                        'military',
                        'political',
                        ' and take ',
                        actions,
                        ' additional action',
                        actions > 1 ? 's' : ''
                    ];
                }
                return ['military', 'political', '', '', '', ''];
            })
            .max(perConflict(1));
    }

    private getExtraActionCount(context: AbilityContext) {
        const conflict = context.game.currentConflict;
        if(!conflict) {
            return 0;
        }
        return context.player.isAttackingPlayer()
            ? conflict.defenders.length
            : conflict.attackers.length;
    }
}
