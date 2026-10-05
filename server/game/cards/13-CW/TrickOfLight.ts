import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType } from '../../Constants.js';

class TrickOfTheLight extends DrawCard {
    static id = 'trick-of-the-light';

    setupCardAbilities() {
        this.action('blanks printed text for conflict')
            .target({
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating()
            }, AbilityDsl.actions.cardLastingEffect({
                effect: AbilityDsl.effects.blank()
            }));
    }
}

export default TrickOfTheLight;
