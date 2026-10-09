import { msg } from '../../../GameChat.js';
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
                        message: () => msg`${context.target} gets +1${'military'} and +1${'political'} due to the delayed effect of ${context.source}`,
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
            .chatText((context) => {
                const actions = this.getExtraActionCount(context);
                return actions > 0
                    ? msg`give ${context.chatTarget()} +1${'military'} and +1${'political'} after each event they play and take ${actions} additional action${actions > 1 ? 's' : ''}`
                    : msg`give ${context.chatTarget()} +1${'military'} and +1${'political'} after each event they play`;
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
