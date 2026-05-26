import DrawCard from '../../drawcard.js';
import { Locations, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class FrontlineEngineer extends DrawCard {
    static id = 'frontline-engineer';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.modifyGlory(() => this.getHoldingsInPlay())
        });

        this.action({
            title: 'Place a holding from your deck faceup in the defending province',
            condition: context => context.player.dynastyDeck.length > 0 && context.source.isDefending(),
            effect: 'look at the top five cards of their dynasty deck',
            gameAction: AbilityDsl.actions.selectCard(context => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                cardCondition: card => card.isConflictProvince(),
                subActionProperties: card => {
                    context.target = card;
                    return ({ target: card });
                },
                gameAction: AbilityDsl.actions.handler({
                    handler: context => this.game.promptWithHandlerMenu(context.player, {
                        activePromptTitle: 'Choose a holding',
                        context: context,
                        cardCondition: (card: any) => card.getType() === CardTypes.Holding,
                        cards: context.player.dynastyDeck.slice(0, 5),
                        choices: ['Take nothing'],
                        handlers: [() => {
                            this.game.addMessage('{0} takes nothing', context.player);
                            context.player.shuffleDynastyDeck();
                            return true;
                        }],
                        cardHandler: (cardFromDeck: any) => {
                            let cards = context.player.getDynastyCardsInProvince(context.target.location);
                            this.game.addMessage('{0} discards {1}, replacing it with {2}', context.player, cards, cardFromDeck);
                            context.player.moveCard(cardFromDeck, context.target.location);
                            cardFromDeck.facedown = false;
                            cards.forEach(element => {
                                context.player.moveCard(element, Locations.DynastyDiscardPile);
                            });
                            context.player.shuffleDynastyDeck();
                        }
                    })
                })
            }))
        });
    }

    getHoldingsInPlay() {
        return this.game.allCards.reduce((sum, card) => {
            if(card.isFaceup() && (card.isInProvince() && card.type === CardTypes.Holding)) {
                return sum + 1;
            }
            return sum;
        }, 0);
    }
}


export default FrontlineEngineer;
