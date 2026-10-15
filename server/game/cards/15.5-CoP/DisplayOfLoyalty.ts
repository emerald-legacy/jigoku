import DrawCard from '../../DrawCard.js';
import { CardType, Players } from '../../Constants.js';
import { dishonor } from '../../GameActions/GameActions.js';

class DisplayOfLoyalty extends DrawCard {
    static id = 'display-of-loyalty';

    setupCardAbilities() {
        this.action('Dishonor a character')
            .target({
                controller: Players.Any,
                cardType: CardType.Character,
                cardCondition: (card, context) => {
                    const charactersInPlay = context.game.findAnyCardsInPlay((c) => c.type === CardType.Character);
                    return card.getFate() === Math.max(...charactersInPlay.map((c) => c.getFate()));
                }
            }, dishonor());
    }
}


export default DisplayOfLoyalty;
