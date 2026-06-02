import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Duration } from '../../Constants.js';

class TrickOfTheLight extends DrawCard {
    static id = 'trick-of-the-light';

    setupCardAbilities() {
        this.action({
            title: 'blanks printed text for conflict',
            target: {
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                    effect: AbilityDsl.effects.blank(),
                    duration: Duration.UntilEndOfConflict
                }))
            }
        });
    }
}

export default TrickOfTheLight;
