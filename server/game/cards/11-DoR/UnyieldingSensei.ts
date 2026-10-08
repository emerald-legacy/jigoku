import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { CardType, Players, Location, DeckType } from '../../Constants.js';
import { moveCard } from '../../GameActions/GameActions.js';

class UnyieldingSensei extends DrawCard {
    static id = 'unyielding-sensei';

    setupCardAbilities() {
        this.action('Choose a province')
            .target({
                cardType: CardType.Province,
                controller: Players.Self,
                location: Location.Provinces,
                cardCondition: (card, context) => !card.isBroken && context.player.getDynastyCardsInProvince(card.location).some((c) => c.getType() === CardType.Holding && c.isFaceup())
            })
            .deckSearch({
                activePromptTitle: 'Choose a character',
                cardsToLookAt: 2,
                deck: DeckType.Dynasty,
                cardCondition: (card) => card.type === CardType.Character,
                shuffle: false,
                message: (context, cards) => {
                    const province = context.target;
                    return msg`${context.player} puts ${cards} into ${province?.isFacedown() ? 'a facedown province' : province?.name}`;
                },
                gameAction: moveCard((context) => ({
                    destination: context.target?.location,
                    faceup: true
                }))
            })
            .chatText('look at the top two cards of their dynasty deck');
    }
}


export default UnyieldingSensei;

