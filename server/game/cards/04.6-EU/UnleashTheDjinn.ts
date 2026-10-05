import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class UnleashTheDjinn extends DrawCard {
    static id = 'unleash-the-djinn';

    setupCardAbilities() {
        this.action('Make all participating characters 3/3')
            .cost(AbilityDsl.costs.payHonor(3))
            .condition(() => this.game.isDuringConflict())
            .gameAction(AbilityDsl.actions.cardLastingEffect(context => ({
                target: context.game.currentConflict?.getParticipants(),
                effect: [
                    AbilityDsl.effects.setMilitarySkill(3),
                    AbilityDsl.effects.setPoliticalSkill(3)
                ]
            })))
            .effect('make all participating characters 3{1}/3{2}', () => ['military', 'political']);
    }
}


export default UnleashTheDjinn;
