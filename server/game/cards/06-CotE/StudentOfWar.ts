import { cardCannot } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
class StudentOfWar extends DrawCard {
    static id = 'student-of-war';

    setupCardAbilities() {
        this.composure({
            effect: [
                cardCannot('removeFate'),
                cardCannot('discardFromPlay')
            ]
        });
    }
}
export default StudentOfWar;
