import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class Smoke extends DrawCard {
    static id = 'smoke';

    setupCardAbilities() {
        this.action('Give non-unique characters -2/+0')
            .cost(AbilityDsl.costs.bowSelf())
            .cost(AbilityDsl.costs.sacrificeSelf())
            .condition(context => !!(this.game.isDuringConflict() && context.source.parentCharacter && context.source.parentCharacter.isParticipating()))
            .gameAction(AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.game.currentConflict?.getParticipants().filter((card: DrawCard) => !card.isUnique()) ?? [],
                effect: AbilityDsl.effects.modifyMilitarySkill(-2)
            })))
            .effect('give all non-unique participating characters -2{1}', () => ['military']);
    }
}


export default Smoke;
