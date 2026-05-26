import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class WayOfTheScorpion extends DrawCard {
    static id = 'way-of-the-scorpion';

    setupCardAbilities(ability: typeof AbilityDsl) {
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
