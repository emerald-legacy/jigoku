import { CardType, Location, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { cardMenu, moveCard, selectCard } from '../../GameActions/GameActions.js';

export default class EmperorsSummons extends ProvinceCard {
    static id = 'emperor-s-summons';

    setupCardAbilities() {
        this.reaction('Search for a character card')
            .when({
                onCardRevealed: (event, context) => event.card === context.source
            })
            .gameAction(cardMenu((context) => ({
                cards: context.player.dynastyDeck.filter((card) => card.type === CardType.Character),
                options: [
                    { text: 'Select nothing', handler: () => this.game.addMessage('{0} selects nothing from their deck', context.player) }
                ],
                gameAction: selectCard({
                    cardType: CardType.Province,
                    location: Location.Provinces,
                    controller: Players.Self,
                    cardCondition: (card) => card.location !== Location.StrongholdProvince,
                    subActionProperties: (card) => ({ destination: card.location }),
                    gameAction: moveCard({ discardDestinationCards: true, faceup: true }),
                    message: '{1} chooses to place {2} in {0} discarding {3}',
                    messageArgs: (card, player, properties) => [
                        card.isFacedown() ? card.location : card,
                        player,
                        properties.target,
                        player.getDynastyCardsInProvince(card.location)
                    ]
                })
            })))
            .effect('choose a character to place in a province');
    }
}
