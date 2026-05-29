import DrawCard from '../../DrawCard.js';
import { CardTypes, Players, Locations, Decks } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class UnyieldingSensei extends DrawCard {
    static id = 'unyielding-sensei';

    setupCardAbilities() {
        this.action({
            title: 'Choose a province',
            target: {
                cardType: CardTypes.Province,
                controller: Players.Self,
                location: Locations.Provinces,
                cardCondition: (card, context) => !card.isBroken && context.player.getDynastyCardsInProvince(card.location).some((c: any) => c.getType() === CardTypes.Holding && c.isFaceup())
            },
            effect: 'look at the top two cards of their dynasty deck',
            gameAction: AbilityDsl.actions.deckSearch({
                activePromptTitle: 'Choose a character',
                amount: 2,
                deck: Decks.DynastyDeck,
                cardCondition: card => card.type === CardTypes.Character,
                shuffle: false,
                message: '{0} puts {1} into {2}',
                messageArgs: (context, cards) => [context.player, cards, (context.target as DrawCard).isFacedown() ? 'a facedown province' : (context.target as DrawCard).name],
                gameAction: AbilityDsl.actions.moveCard(context => ({
                    destination: context.target.location,
                    faceup: true
                }))
            })
        });
    }
}


export default UnyieldingSensei;

