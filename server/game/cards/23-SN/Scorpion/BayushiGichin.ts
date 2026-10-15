import { msg } from '../../../GameChat.js';
import DrawCard from '../../../DrawCard.js';
import { CardType, DuelType, Players, Location, Trait } from '../../../Constants.js';
import { unlimited } from '../../../AbilityLimit.js';
import { attach, noAction, selectCard, sequential, takeHonor } from '../../../GameActions/GameActions.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import type BaseCard from '../../../BaseCard.js';

export default class BayushiGichin extends DrawCard {
    static id = 'bayushi-gichin';

    setupCardAbilities() {
        this.duelStrike('Poison a character', (duel, context) => duel.participants.includes(context.source))
            .gameAction(sequential((context) => {
                let character: BaseCard | undefined;
                let poison: DrawCard | undefined;
                return [
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
                        message: (context, cards) => msg`${context.player} poisons ${cards}`,
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
                        cardCondition: (card) => card.hasTrait(Trait.Poison) && !!character && attach().canAffect(character, context, { attachment: card }),
                        message: (context, cards) => msg`${context.player} attaches ${cards}`,
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
                ];
            }))
            .limit(unlimited());

        this.conflictAction('Military duel to steal honor')
            .initiateDuel(() => ({
                type: DuelType.Military,
                gameAction: (duel, context) => {
                    if(context.source.isDrawCard() && duel.winner.includes(context.source)) {
                        return takeHonor({ target: duel.loserController });
                    }
                    return noAction();
                }
            }));
    }

    private getPoisons(context: AbilityContext) {
        const player = context.player;
        const inDiscard = player.conflictDiscardPile.filter((card) => card.hasTrait(Trait.Poison));
        const inHand = player.hand.filter((card) => card.hasTrait(Trait.Poison));

        return [...inDiscard, ...inHand];
    }
}
