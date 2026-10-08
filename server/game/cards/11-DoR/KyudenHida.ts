import { msg } from '../../GameChat.js';
import { CardType, Location, Phase, PlayType } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import * as costs from '../../costs/index.js';
import { cardMenu, moveCard, multiple, playCard, sequentialContext } from '../../GameActions/GameActions.js';

export default class KyudenHida extends StrongholdCard {
    static id = 'kyuden-hida';

    setupCardAbilities() {
        this.action('Play a Character')
            .cost(costs.bowSelf())
            .condition((context) => context.player.dynastyDeck.length > 0)
            .gameAction(sequentialContext((context) => {
                const topCards = context.player.dynastyDeck.slice(0, 3);
                return {
                    gameActions: [cardMenu({
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
                                    this.game.addMessage(msg`${context.player} chooses not to play a character`);
                                    this.game.addMessage(msg`${context.player} discards ${topCards}`);
                                    return true;
                                }
                            }
                        ],
                        gameAction: multiple([
                            playCard({
                                source: this,
                                resetOnCancel: false,
                                playType: PlayType.PlayFromProvince,
                                postHandler: (hidaContext) => {
                                    const card = hidaContext.source;
                                    let discardedCards = topCards;
                                    if(card.location !== Location.PlayArea) {
                                        this.game.addMessage(msg`${context.player} chooses not to play a character`);
                                    } else {
                                        discardedCards = topCards.filter((a) => a !== card);
                                    }
                                    this.game.addMessage(msg`${context.player} discards ${discardedCards}`);
                                }
                            }),
                            moveCard((context) => ({
                                target: topCards.filter((a) => a !== context.target),
                                destination: Location.DynastyDiscardPile
                            }))
                        ])
                    })]
                };
            }))
            .chatText('look at the top three cards of their dynasty deck')
            .phase(Phase.Dynasty);
    }
}
