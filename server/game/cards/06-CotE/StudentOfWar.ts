import DrawCard from '../../drawcard.js';
class StudentOfWar extends DrawCard {
    static id = 'student-of-war';

    setupCardAbilities(ability) {
        this.composure({
            effect: [
                ability.effects.cardCannot('removeFate'),
                ability.effects.cardCannot('discardFromPlay')
            ]
        });
    }
}
export default StudentOfWar;
