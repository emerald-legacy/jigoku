import DrawCard from '../../DrawCard.js';
import { blank } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { CardType } from '../../Constants.js';

class TrickOfTheLight extends DrawCard {
    static id = 'trick-of-the-light';

    setupCardAbilities() {
        this.action('blanks printed text for conflict')
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, cardLastingEffect({
                effect: blank()
            }));
    }
}

export default TrickOfTheLight;
