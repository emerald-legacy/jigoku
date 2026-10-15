import { cardCannot } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { RestrictionType } from '../../Constants.js';
class StudentOfWar extends DrawCard {
    static id = 'student-of-war';

    setupCardAbilities() {
        this.composure({
            effect: [
                cardCannot(RestrictionType.RemoveFate),
                cardCannot(RestrictionType.DiscardFromPlay)
            ]
        });
    }
}
export default StudentOfWar;
