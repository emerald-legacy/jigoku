import { CardType, Location, Phases, PlayType } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class KyudenHida extends StrongholdCard {
    static id = 'kyuden-hida';

    setupCardAbilities() {
        this.action('Play a Character')
            .cost(AbilityDsl.costs.bowSelf())
            .condition((context) => context.player.dynastyDeck.length > 0)
            .gameAction(AbilityDsl.actions.sequentialContext((context) => {
                const topCards = context.player.dynastyDeck.slice(0, 3);
                return {
                    gameActions: [AbilityDsl.actions.cardMenu({
                        activePromptTitle: 'Choose a character',
                        cards: topCards,
                        cardCondition: (card) => card.type === CardType.Character,
                        options: [
                            {
                                text: 'Take nothing',
                                handler: () => {
                                    topCards.forEach((card) => {
                                        context.player.moveCard(card, Location.DynastyDiscardPile);
                                    });
                                    this.game.addMessage('{0} chooses not to play a character', context.player);
                                    this.game.addMessage('{0} discards {1}', context.player, topCards);
                                    return true;
                                }
                            }
                        ],
                        gameAction: AbilityDsl.actions.multiple([
                            AbilityDsl.actions.playCard({
                                source: this,
                                resetOnCancel: false,
                                playType: PlayType.PlayFromProvince,
                                postHandler: (hidaContext) => {
                                    const card = hidaContext.source;
                                    let discardedCards = topCards;
                                    if(card.location !== Location.PlayArea) {
                                        this.game.addMessage('{0} chooses not to play a character', context.player);
                                    } else {
                                        discardedCards = topCards.filter((a) => a !== card);
                                    }
                                    this.game.addMessage('{0} discards {1}', context.player, discardedCards);
                                }
                            }),
                            AbilityDsl.actions.moveCard((context) => ({
                                target: topCards.filter((a) => a !== context.target),
                                destination: Location.DynastyDiscardPile
                            }))
                        ])
                    })]
                };
            }))
            .effect('look at the top three cards of their dynasty deck')
            .phase(Phases.Dynasty);
    }
}
