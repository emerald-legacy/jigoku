import { CardType, Location, Phases, PlayType } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';
import type DrawCard from '../../DrawCard.js';

export default class KyudenHida extends StrongholdCard {
    static id = 'kyuden-hida';

    kyudenHidaCards: DrawCard[] = [];

    setupCardAbilities() {
        this.action({
            title: 'Play a Character',
            condition: (context) => context.player.dynastyDeck.length > 0,
            phase: Phases.Dynasty,
            cost: [AbilityDsl.costs.bowSelf()],
            effect: 'look at the top three cards of their dynasty deck',
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.handler({
                    handler: (context) => (this.kyudenHidaCards = context.player.dynastyDeck.slice(0, 3))
                }),
                AbilityDsl.actions.cardMenu((context) => ({
                    activePromptTitle: 'Choose a character',
                    cards: this.kyudenHidaCards,
                    cardCondition: (card) => card.type === CardType.Character,
                    choices: ['Take nothing'],
                    handlers: [
                        () => {
                            const cards = this.kyudenHidaCards;
                            cards.forEach((card) => {
                                context.player.moveCard(card, Location.DynastyDiscardPile);
                            });
                            this.game.addMessage('{0} chooses not to play a character', context.player);
                            this.game.addMessage('{0} discards {1}', context.player, cards);
                            return true;
                        }
                    ],
                    gameAction: AbilityDsl.actions.multiple([
                        AbilityDsl.actions.playCard({
                            source: this,
                            resetOnCancel: false,
                            playType: PlayType.PlayFromProvince,
                            postHandler: (hidaContext) => {
                                const card = hidaContext.source;
                                let discardedCards = this.kyudenHidaCards;
                                if(card.location !== Location.PlayArea) {
                                    this.game.addMessage('{0} chooses not to play a character', context.player);
                                } else {
                                    discardedCards = this.kyudenHidaCards.filter((a) => a !== card);
                                }
                                this.game.addMessage('{0} discards {1}', context.player, discardedCards);
                            }
                        }),
                        AbilityDsl.actions.moveCard((context) => ({
                            target: this.kyudenHidaCards.filter((a) => a !== context.target),
                            destination: Location.DynastyDiscardPile
                        }))
                    ])
                }))
            ])
        });
    }
}
