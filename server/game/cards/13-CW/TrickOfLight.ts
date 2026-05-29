import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, Durations } from '../../Constants.js';

class TrickOfTheLight extends DrawCard {
    static id = 'trick-of-the-light';

    setupCardAbilities() {
        this.action({
            title: 'blanks printed text for conflict',
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                    effect: AbilityDsl.effects.blank(),
                    duration: Durations.UntilEndOfConflict
                }))
            }
        });
    }
}

export default TrickOfTheLight;
