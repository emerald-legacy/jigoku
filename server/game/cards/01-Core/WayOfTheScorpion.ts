import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { dishonor } from '../../GameActions/GameActions.js';

class WayOfTheScorpion extends DrawCard {
    static id = 'way-of-the-scorpion';

    setupCardAbilities() {
        this.action('Dishonor a participating character')
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating() && !card.isFaction('scorpion')
            }, dishonor());
    }
}


export default WayOfTheScorpion;
