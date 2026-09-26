import DrawCard from '../../DrawCard.js';
import type { ProvinceCard } from '../../ProvinceCard.js';
import { CardType, Players, Location, Decks } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class UnyieldingSensei extends DrawCard {
    static id = 'unyielding-sensei';

    setupCardAbilities() {
        this.action('Choose a province')
            .target('target', {
                cardType: CardType.Province,
                controller: Players.Self,
                location: Location.Provinces,
                cardCondition: (card, context) => !card.isBroken && context.player.getDynastyCardsInProvince(card.location).some(c => c.getType() === CardType.Holding && c.isFaceup())
            })
            .gameAction(AbilityDsl.actions.deckSearch({
                activePromptTitle: 'Choose a character',
                amount: 2,
                deck: Decks.DynastyDeck,
                cardCondition: card => card.type === CardType.Character,
                shuffle: false,
                message: '{0} puts {1} into {2}',
                messageArgs: (context, cards) => {
                    const province = context.target as ProvinceCard;
                    return [context.player, cards, province.isFacedown() ? 'a facedown province' : province.name];
                },
                gameAction: AbilityDsl.actions.moveCard<ProvinceCard>(context => ({
                    destination: context.target?.location,
                    faceup: true
                }))
            }))
            .effect('look at the top two cards of their dynasty deck');
    }
}


export default UnyieldingSensei;

