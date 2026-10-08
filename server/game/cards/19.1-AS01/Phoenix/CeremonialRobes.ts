import type { AbilityContext } from '../../../AbilityContext.js';
import { msg, type MessageArgs } from '../../../GameChat.js';
import { modifyGlory } from '../../../effects.js';
import { loseHonor } from '../../../GameActions/GameActions.js';
import type BaseCard from '../../../BaseCard.js';
import { CardType, Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

type HandlerStep = {
    activePromptTitle: string;
    message: (chosenCard: BaseCard) => MessageArgs;
    callback: (chosenCard: BaseCard) => void;
};

export default class CeremonialRobes extends DrawCard {
    static id = 'ceremonial-robes';

    public setupCardAbilities() {
        this.persistentEffect({
            effect: modifyGlory((_character, context) =>
                context.player.cardsInPlay.reduce(
                    (sum, card) => (card.type === CardType.Character && card.hasTrait('spirit') ? sum + 1 : sum),
                    0
                )
            )
        });

        this.action('Place a card from your deck faceup on a province')
            .target({
                location: Location.Provinces,
                cardType: CardType.Province,
                cardCondition: (card) => card.location !== Location.StrongholdProvince,
                controller: Players.Self
            })
            .handler((context) => {
                const steps: HandlerStep[] = [
                    {
                        activePromptTitle: 'Select a card to put into the province faceup',
                        message: (chosenCard) => msg`${context.player} places ${chosenCard} into their province`,
                        callback: (chosenCard) => {
                            context.player.moveCard(chosenCard, context.target.location);
                            chosenCard.facedown = false;
                        }
                    },
                    {
                        activePromptTitle: 'Select a card to put on the bottom of the deck',
                        message: () => msg`${context.player} places a card on the bottom of the deck`,
                        callback: (chosenCard) => context.player.moveCard(chosenCard, Location.DynastyDeck, { bottom: true })
                    },
                    {
                        activePromptTitle: 'Select a card to discard',
                        message: (chosenCard) => msg`${context.player} discards ${chosenCard}`,
                        callback: (chosenCard) => {
                            context.player.moveCard(chosenCard, Location.DynastyDiscardPile);
                            if(chosenCard.hasTrait('spirit')) {
                                this.game.addMessage(
                                    '{0} was a Spirit! {1} and {2} lose 1 honor',
                                    chosenCard,
                                    context.player,
                                    context.player.opponent
                                );
                                loseHonor((innerContext) => ({ target: innerContext.game.getPlayers() }))
                                    .resolve(chosenCard, context);
                            }
                        }
                    }
                ];

                this.resolveSteps(context, steps, context.player.dynastyDeck.slice(0, 3));
            })
            .chatText('look at the top 3 cards of their dynasty deck')
            .evenDuringDynasty();
    }

    // A step with a single card left resolves without a prompt and ends the ability
    private resolveSteps(context: AbilityContext, [step, ...nextSteps]: HandlerStep[], cards: BaseCard[]) {
        if(!step || cards.length === 0) {
            return;
        }
        const resolve = (card: BaseCard) => {
            const [format, args] = step.message(card);
            this.game.addMessage(format, ...args);
            step.callback(card);
        };
        if(cards.length === 1) {
            resolve(cards[0]);
            return;
        }

        this.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: step.activePromptTitle,
            context: context,
            cards: cards,
            cardHandler: (selectedCard) => {
                resolve(selectedCard);
                this.resolveSteps(context, nextSteps, cards.filter((c) => c !== selectedCard));
            }
        });
    }
}
