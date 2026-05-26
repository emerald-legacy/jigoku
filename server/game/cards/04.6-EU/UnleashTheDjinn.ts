import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';

class UnleashTheDjinn extends DrawCard {
    static id = 'unleash-the-djinn';

    setupCardAbilities() {
        this.action({
            title: 'Make all participating characters 3/3',
            condition: () => this.game.isDuringConflict(),
            cost: AbilityDsl.costs.payHonor(3),
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                target: context.game.currentConflict.getParticipants(),
                effect: [
                    AbilityDsl.effects.setMilitarySkill(3),
                    AbilityDsl.effects.setPoliticalSkill(3)
                ]
            })),
            effect: 'make all participating characters 3{1}/3{2}',
            effectArgs: () => ['military', 'political']
        });
    }
}


export default UnleashTheDjinn;
