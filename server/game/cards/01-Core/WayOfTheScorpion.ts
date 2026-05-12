import DrawCard from '../../drawcard';
import { CardTypes } from '../../Constants';

class WayOfTheScorpion extends DrawCard {
    static id = 'way-of-the-scorpion';

    setupCardAbilities(ability) {
        this.action({
            title: 'Dishonor a participating character',
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating() && !card.isFaction('scorpion'),
                gameAction: ability.actions.dishonor()
            }
        });
    }
}


export default WayOfTheScorpion;
