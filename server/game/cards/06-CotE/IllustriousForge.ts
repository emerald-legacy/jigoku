import type { AbilityContext } from '../../AbilityContext.js';
import { msg } from '../../GameChat.js';
import { CardType, Location, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { attach, cardMenu, selectCard, sequential, shuffleDeck } from '../../GameActions/GameActions.js';
import type BaseCard from '../../BaseCard.js';

export default class IllustriousForge extends ProvinceCard {
    static id = 'illustrious-forge';

    setupCardAbilities() {
        this.reaction('Search for an attachment')
            .when({
                onCardRevealed: (event, context) =>
                    event.card === context.source && context.player.conflictDeck.length > 0
            })
            .gameAction(sequential([
                cardMenu((context) => ({
                    activePromptTitle: 'Choose an attachment',
                    cards: context.player.conflictDeck.slice(0, 5),
                    cardCondition: (card) => card.type === CardType.Attachment,
                    options: [
                        {
                            text: 'Take nothing',
                            handler: () => {
                                this.game.addMessage('{0} takes nothing', context.player);
                                return true;
                            }
                        }
                    ],
                    // the chosen attachment reaches the message through the select's properties
                    subActionProperties: (attachment) => ({
                        attachment,
                        message: (context: AbilityContext, card: BaseCard | BaseCard[]) => msg`${context.player} chooses to attach ${attachment} to ${card}`
                    }),
                    gameAction: selectCard({
                        controller: Players.Self,
                        location: Location.PlayArea,
                        cardType: CardType.Character,
                        gameAction: attach()
                    })
                })),
                shuffleDeck((context) => ({
                    deck: Location.ConflictDeck,
                    target: context.player
                }))
            ]))
            .chatText('search the top 5 cards of their conflict deck for an attachment and put it into play');
    }
}
