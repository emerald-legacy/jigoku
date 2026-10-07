import * as costs from '../../costs/index.js';
import { setMilitarySkill, setPoliticalSkill } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { msg } from '../../GameChat.js';

class UnleashTheDjinn extends DrawCard {
    static id = 'unleash-the-djinn';

    setupCardAbilities() {
        this.action('Make all participating characters 3/3')
            .cost(costs.payHonor(3))
            .condition(() => this.game.isDuringConflict())
            .cardLastingEffect(context => ({
                target: context.game.currentConflict?.getParticipants(),
                effect: [
                    setMilitarySkill(3),
                    setPoliticalSkill(3)
                ]
            }))
            .effect(() => msg`make all participating characters 3${'military'}/3${'political'}`);
    }
}


export default UnleashTheDjinn;
