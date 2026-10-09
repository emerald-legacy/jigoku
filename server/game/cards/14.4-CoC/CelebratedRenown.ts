import DrawCard from '../../DrawCard.js';
import { CardType, Players } from '../../Constants.js';
import { honor } from '../../GameActions/GameActions.js';

class CelebratedRenown extends DrawCard {
    static id = 'celebrated-renown';

    setupCardAbilities() {
        this.action('Honor a character')
            .target({
                controller: Players.Any,
                cardType: CardType.Character,
                cardCondition: (card, context) => {
                    const charactersInPlay = context.game.findAnyCardsInPlay((c) => c.type === CardType.Character);
                    return card.getFate() === Math.max(...charactersInPlay.map((c) => c.getFate()));
                }
            }, honor());
    }
}


export default CelebratedRenown;
