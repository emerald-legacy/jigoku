import { msg } from '../../../GameChat.js';
import { CardType, DeckType, Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class AsahinaEnvoy extends DrawCard {
    static id = 'asahina-envoy';

    setupCardAbilities() {
        this.interrupt('Put a character into a province')
            .when({
                onCardLeavesPlay: (event, context) => event.card === context.source
            })
            .deckSearch({
                cardCondition: (card) =>
                    card.type === CardType.Character && (card.printedCost ?? 0) >= 4 && card.isFaction('crane'),
                cardsToLookAt: 6,
                deck: DeckType.Dynasty,
                selectedCardsHandler: (context, event, [character]) => {
                    if(!character) {
                        return this.game.addMessage(msg`${event.player} selects no characters`);
                    }
                    this.game.promptForSelect(event.player, {
                        activePromptTitle: 'Choose a province for ' + character.name,
                        context: context,
                        cardType: CardType.Province,
                        location: Location.Provinces,
                        controller: Players.Self,
                        cardCondition: (card) => card.location !== Location.StrongholdProvince,
                        onSelect: (player, province) => {
                            this.game.addMessage(msg`${player} selects ${character} and puts it into ${province.facedown ? province.location : province}`);
                            player.moveCard(character, province.location);
                            character.facedown = false;
                            return true;
                        }
                    });
                }
            })
            .chatText('put a character from their deck into a province');
    }
}
