import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import type BaseCard from '../../../BaseCard.js';
import { CardType, Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

type HandlerStep = {
    activePromptTitle: string;
    message: string;
    callback: (chosenCard: BaseCard) => void;
};

export default class CeremonialRobes extends DrawCard {
    static id = 'ceremonial-robes';

    public setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.modifyGlory((_character: BaseCard, context: AbilityContext) =>
                (context.player.cardsInPlay as BaseCard[]).reduce(
                    (sum: number, card: BaseCard) => (card.type === CardType.Character && card.hasTrait('spirit') ? sum + 1 : sum),
                    0
                )
            )
        });

        this.action({
            title: 'Place a card from your deck faceup on a province',
            effect: 'look at the top 3 cards of their dynasty deck',
            evenDuringDynasty: true,
            target: {
                location: Location.Provinces,
                cardType: CardType.Province,
                cardCondition: (card) => card.location !== Location.StrongholdProvince,
                controller: Players.Self
            },
            handler: (context) => {
                const ctx = context;
                const top3Cards = ctx.player.dynastyDeck.slice(0, 3);
                const steps: HandlerStep[] = [
                    {
                        activePromptTitle: 'Select a card to put into the province faceup',
                        message: '{0} places {1} into their province',
                        callback: (chosenCard) => {
                            ctx.player.moveCard(chosenCard, (ctx.target as DrawCard).location);
                            chosenCard.facedown = false;
                        }
                    },
                    {
                        activePromptTitle: 'Select a card to put on the bottom of the deck',
                        message: '{0} places a card on the bottom of the deck',
                        callback: (chosenCard) => ctx.player.moveCard(chosenCard, 'dynasty deck bottom')
                    },
                    {
                        activePromptTitle: 'Select a card to discard',
                        message: '{0} discards {1}',
                        callback: (chosenCard) => {
                            ctx.player.moveCard(chosenCard, Location.DynastyDiscardPile);
                            if(chosenCard.hasTrait('spirit')) {
                                this.game.addMessage(
                                    '{0} was a Spirit! {1} and {2} lose 1 honor',
                                    chosenCard,
                                    ctx.player,
                                    ctx.player.opponent
                                );
                                AbilityDsl.actions
                                    .loseHonor((innerContext) => ({ target: innerContext.game.getPlayers() }))
                                    .resolve(chosenCard, ctx);
                            }
                        }
                    }
                ];

                this.recursivePromptHandler(steps, ctx, top3Cards);
            }
        });
    }

    private recursivePromptHandler(
        remainingSteps: HandlerStep[],
        context: AbilityContext,
        selectableCards: BaseCard[]
    ) {
        const currentStep = remainingSteps.shift();
        if(!currentStep) {
            return;
        }
        if(selectableCards.length === 0) {
            return;
        }
        if(selectableCards.length === 1) {
            const lastCard = selectableCards[0];
            this.game.addMessage(currentStep.message, context.player, lastCard, context.target);
            currentStep.callback(lastCard);
            return;
        }

        this.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: currentStep.activePromptTitle,
            context: context,
            cards: selectableCards,
            cardHandler: (selectedCard: BaseCard) => {
                this.game.addMessage(currentStep.message, context.player, selectedCard, context.target);
                currentStep.callback(selectedCard);

                const newSelectableCards = selectableCards.filter((c) => c !== selectedCard);
                this.recursivePromptHandler(remainingSteps, context, newSelectableCards);
            }
        });
    }
}
