import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class WayOfTheScorpion extends DrawCard {
    static id = 'way-of-the-scorpion';

    setupCardAbilities() {
        this.action('Dishonor a participating character')
            .target('target', {
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating() && !card.isFaction('scorpion')
            }, AbilityDsl.actions.dishonor());
    }
}


export default WayOfTheScorpion;
