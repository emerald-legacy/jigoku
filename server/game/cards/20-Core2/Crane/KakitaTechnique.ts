import type { AbilityContext } from '../../../AbilityContext.js';
import { CardTypes, Durations, EventNames, Players } from '../../../Constants.js';
import { Direction } from '../../../GameActions/ModifyBidAction.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
export default class KakitaTechnique extends DrawCard {
    static id = 'kakita-technique';

    setupCardAbilities() {
        this.duelFocus({
            title: 'Set bid to 0',
            gameAction: AbilityDsl.actions.modifyBid((context) => {
                const currentBid = context.player.honorBid;
                return {
                    amount: currentBid,
                    direction: Direction.Decrease
                };
            })
        });

        this.action({
            title: 'Give character +1/+1',
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating() && (card.hasTrait('bushi') || card.hasTrait('duelist')),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.cardLastingEffect((context) => ({
                        effect: AbilityDsl.effects.delayedEffect({
                            when: {
                                onCardPlayed: (event: EventPayload<EventNames.OnCardPlayed>, context: AbilityContext) =>
                                    event.player === context.player && event.card.type === CardTypes.Event
                            },
                            message: '{0} gets +1{1} and +1{2} due to the delayed effect of {3}',
                            messageArgs: () => [context.target, 'military', 'political', context.source],
                            multipleTrigger: true,
                            gameAction: AbilityDsl.actions.cardLastingEffect({
                                target: context.target,
                                effect: AbilityDsl.effects.modifyBothSkills(1)
                            })
                        })
                    })),
                    AbilityDsl.actions.playerLastingEffect((context) => ({
                        targetController: context.player,
                        duration: Durations.UntilPassPriority,
                        effect: AbilityDsl.effects.additionalAction(this.#getExtraActionCount(context))
                    }))
                ])
            },
            effect: 'give {0} +1{1} and +1{2} after each event they play{3}{4}{5}{6}',
            effectArgs: (context) => {
                const actions = this.#getExtraActionCount(context);
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
            },
            max: AbilityDsl.limit.perConflict(1)
        });
    }

    #getExtraActionCount(context: AbilityContext) {
        const conflict = context.game.currentConflict;
        if(!conflict) {
            return 0;
        }
        return context.player.isAttackingPlayer()
            ? conflict.defenders.length
            : conflict.attackers.length;
    }
}
