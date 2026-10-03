import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
class StudentOfWar extends DrawCard {
    static id = 'student-of-war';

    setupCardAbilities() {
        this.composure({
            effect: [
                AbilityDsl.effects.cardCannot('removeFate'),
                AbilityDsl.effects.cardCannot('discardFromPlay')
            ]
        });
    }
}
export default StudentOfWar;
