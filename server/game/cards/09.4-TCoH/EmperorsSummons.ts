import type Player from '../../Player.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { msg } from '../../GameChat.js';
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
                // the menu's chosen character reaches the select's message here
                subActionProperties: (character) => ({
                    target: character,
                    message: (_context: AbilityContext, province: ProvinceCard, chooser: Player) =>
                        msg`${chooser} chooses to place ${character} in ${province.isFacedown() ? province.location : province} discarding ${chooser.getDynastyCardsInProvince(province.location)}`
                }),
                gameAction: selectCard({
                    cardType: CardType.Province,
                    location: Location.Provinces,
                    controller: Players.Self,
                    cardCondition: (card) => card.location !== Location.StrongholdProvince,
                    subActionProperties: (card) => ({ destination: card.location }),
                    gameAction: moveCard({ discardDestinationCards: true, faceup: true })
                })
            })))
            .chatText('choose a character to place in a province');
    }
}
