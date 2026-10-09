import { msg, type MsgArg } from '../../GameChat.js';
import { CardType, DeckType, Location, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type DrawCard from '../../DrawCard.js';

export default class BreakingIn extends ProvinceCard {
    static id = 'breaking-in';

    setupCardAbilities() {
        this.reaction('Search for a character card')
            .when({
                onCardRevealed: (event, context) => event.card === context.source
            })
            .deckSearch({
                activePromptTitle: 'Select a card:',
                cardsToLookAt: 8,
                deck: DeckType.Dynasty,
                cardCondition: (card) => card.type === CardType.Character,
                selectedCardsHandler: (context, _event, [card]) => this.place(context, card)
            })
            .chatText('choose a character to place in a province');
    }

    private place(context: AbilityContext, card: DrawCard | undefined): void {
        if(!card) {
            this.game.addMessage(msg`${context.player} selects nothing from their deck`);
            return;
        }
        if(!card.hasTrait('cavalry')) {
            this.putInto(context, card, context.source.location, context.source);
            return;
        }
        this.game.promptForSelect(context.player, {
            activePromptTitle: 'Choose a province',
            context: context,
            cardType: [CardType.Province],
            location: Location.Provinces,
            controller: Players.Self,
            onSelect: (_player, province) => {
                this.putInto(context, card, province.location, province.facedown ? province.location : province);
                return true;
            }
        });
    }

    private putInto(context: AbilityContext, card: DrawCard, location: Location, named: MsgArg): void {
        this.game.addMessage(msg`${context.player} places ${card} in ${named}`);
        context.player.moveCard(card, location);
        card.facedown = false;
    }
}
