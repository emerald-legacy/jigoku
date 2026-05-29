import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
class StudentOfWar extends DrawCard {
    static id = 'student-of-war';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.composure({
            effect: [
                ability.effects.cardCannot('removeFate'),
                ability.effects.cardCannot('discardFromPlay')
            ]
        });
    }
}
export default StudentOfWar;
