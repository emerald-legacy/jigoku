import DrawCard from '../../../DrawCard.js';
import { CardType, DuelType, Players, Location } from '../../../Constants.js';
import { unlimitedPerConflict } from '../../../AbilityLimit.js';
import { attach, noAction, selectCard, sequentialContext, takeHonor } from '../../../GameActions/GameActions.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import type BaseCard from '../../../BaseCard.js';

export default class BayushiGichin extends DrawCard {
    static id = 'bayushi-gichin';

    setupCardAbilities() {
        this.duelStrike('Poison a character', (duel, context) => duel.participants.includes(context.source))
            .gameAction(sequentialContext((context) => {
                let character: BaseCard | undefined;
                let poison: DrawCard | undefined;
                return {
                    gameActions: [
                        selectCard({
                            activePromptTitle: 'Choose a duel participant',
                            cardType: CardType.Character,
                            controller: Players.Opponent,
                            cardCondition: (card) => {
                                if(!context.event.duel.isInvolved(card)) {
                                    return false;
                                }
                                const poisons = this.getPoisons(context);
                                return poisons.some((p) => attach().canAffect(card, context, { attachment: p }));
                            },
                            message: '{0} poisons {1}',
                            messageArgs: (cards) => {
                                return [context.player, cards];
                            },
                            subActionProperties: (card) => {
                                character = Array.isArray(card) ? undefined : card;
                                return { target: card };
                            },
                            gameAction: noAction()
                        }),
                        selectCard({
                            activePromptTitle: 'Choose a poison attachment',
                            cardType: CardType.Attachment,
                            controller: Players.Self,
                            location: [Location.Hand, Location.ConflictDiscardPile, Location.DynastyDiscardPile],
                            cardCondition: (card) => card.hasTrait('poison') && !!character && attach().canAffect(character, context, { attachment: card }),
                            message: '{0} attaches {1}',
                            messageArgs: (cards) => {
                                return [context.player, cards];
                            },
                            subActionProperties: (card) => {
                                poison = !Array.isArray(card) && card.isDrawCard() ? card : undefined;
                                return { attachment: card };
                            },
                            gameAction: noAction()
                        }),
                        attach(() => {
                            return {
                                target: character,
                                attachment: poison
                            };
                        })
                    ]
                };
            }))
            .limit(unlimitedPerConflict());

        this.conflictAction('Military duel to steal honor')
            .initiateDuel(() => ({
                type: DuelType.Military,
                gameAction: (duel, context) => {
                    if(context.source.isDrawCard() && duel.winner?.includes(context.source)) {
                        return takeHonor({ target: duel.loserController });
                    }
                    return noAction();
                }
            }));
    }

    private getPoisons(context: AbilityContext) {
        const player = context.player;
        const inDiscard = player.conflictDiscardPile.filter((card) => card.hasTrait('poison'));
        const inHand = player.hand.filter((card) => card.hasTrait('poison'));

        return [...inDiscard, ...inHand];
    }
}
