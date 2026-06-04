import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type { ProvinceCard } from '../../ProvinceCard.js';
import { CardType, Players, Location, Decks } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class UnyieldingSensei extends DrawCard {
    static id = 'unyielding-sensei';

    setupCardAbilities() {
        this.action<ProvinceCard>({
            title: 'Choose a province',
            target: {
                cardType: CardType.Province,
                controller: Players.Self,
                location: Location.Provinces,
                cardCondition: (card: ProvinceCard, context: AbilityContext) => !card.isBroken && context.player.getDynastyCardsInProvince(card.location).some(c => c.getType() === CardType.Holding && c.isFaceup())
            },
            effect: 'look at the top two cards of their dynasty deck',
            gameAction: AbilityDsl.actions.deckSearch({
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
            })
        });
    }
}


export default UnyieldingSensei;

