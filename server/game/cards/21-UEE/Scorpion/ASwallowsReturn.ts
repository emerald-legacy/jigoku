import { msg } from '../../../GameChat.js';
import { Location, PlayType } from '../../../Constants.js';
import { cardMenu, discardCard, playCard, sequential } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

const CARD_COUNT = 3;

export default class ASwallowsReturn extends DrawCard {
    static id = 'a-swallow-s-return';

    override setupCardAbilities() {
        this.conflictAction('Look at the top 3 cards of an opponent\'s deck')
            .condition((context) =>
                context.game.currentConflict !== null &&
                context.player.opponent !== undefined &&
                context.player.opponent.conflictDeck.length > 0)
            .gameAction(sequential((context) => {
                const cards = context.player.opponent?.conflictDeck.slice(0, CARD_COUNT) ?? [];
                const rest = () => cards.filter((card) => card.location === Location.ConflictDeck);
                return [
                    cardMenu({
                        activePromptTitle: 'Choose a card to play',
                        cards,
                        cardCondition: (card) =>
                            card.location === Location.ConflictDeck &&
                            // the card may be played from the deck itself (Pillow Book)
                            card.uuid !== context.source.uuid,
                        options: [
                            {
                                text: 'Play nothing',
                                handler: () => {
                                    context.game.addMessage(msg`${context.player} plays nothing and discards ${rest()}`);
                                    return true;
                                }
                            }
                        ],
                        gameAction: playCard({
                            playType: PlayType.PlayFromHand,
                            source: context.source
                        }),
                        message: (_context, card, player) => msg`${player} chooses to play ${card.name} and discard ${cards.filter((c) => c !== card)}`
                    }),
                    discardCard(() => ({ target: rest() }))
                ];
            }))
            .chatText((context) => msg`look at the top ${CARD_COUNT} cards of ${context.player.opponent}'s conflict deck`)
            .cannotBeMirrored();
    }
}
