import AbilityDsl from '../../abilitydsl.js';
import { setMilitarySkill, setPoliticalSkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

class UnleashTheDjinn extends DrawCard {
    static id = 'unleash-the-djinn';

    setupCardAbilities() {
        this.action('Make all participating characters 3/3')
            .cost(AbilityDsl.costs.payHonor(3))
            .condition(() => this.game.isDuringConflict())
            .gameAction(cardLastingEffect(context => ({
                target: context.game.currentConflict?.getParticipants(),
                effect: [
                    setMilitarySkill(3),
                    setPoliticalSkill(3)
                ]
            })))
            .effect('make all participating characters 3{1}/3{2}', () => ['military', 'political']);
    }
}


export default UnleashTheDjinn;
