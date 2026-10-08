import { msg } from '../../../GameChat.js';
import { Location, PlayType } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { cardMenu, discardCard, playCard, sequential } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

const CARD_COUNT = 3;

export default class ASwallowsReturn extends DrawCard {
    static id = 'a-swallow-s-return';

    setupCardAbilities() {
        this.action('Reveal cards and take ones matching named type')
            .cost(costs.revealCardsOf((context) => context.player.opponent?.conflictDeck.slice(0, CARD_COUNT) ?? []))
            .condition((context) =>
                context.game.currentConflict !== null &&
        context.player.opponent !== undefined &&
        context.player.opponent.conflictDeck.length >= CARD_COUNT)
            .gameAction(sequential([
                cardMenu((context) => ({
                    activePromptTitle: 'Choose a card to play',
                    cards: context.costs.reveal ?? [],
                    cardCondition: (card) =>
                        card.location === Location.ConflictDeck &&
            //Handle situations where card is played from deck, such as with pillow book
            card.uuid !== context.source.uuid,
                    options: [
                        {
                            text: 'Play nothing',
                            handler: () => {
                                this.game.addMessage('{0} takes nothing', context.player);
                                return true;
                            }
                        }
                    ],
                    gameAction: playCard({
                        playType: PlayType.PlayFromHand,
                        source: context.source
                    }),
                    message: (context, card, player) => msg`${player} chooses to play ${card.name} and discard ${context.costs.reveal?.filter((c) => c !== card)}`
                })),
                discardCard((context) => ({
                    target: (context.costs.reveal ?? []).filter((card) => card.location === Location.ConflictDeck)
                }))
            ]))
            .chatText('choose one of those to play')
            .cannotBeMirrored();
    }
}
