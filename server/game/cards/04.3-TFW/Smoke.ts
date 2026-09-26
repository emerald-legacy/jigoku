import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class Smoke extends DrawCard {
    static id = 'smoke';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Give non-unique characters -2/+0')
            .cost(ability.costs.bowSelf())
            .cost(ability.costs.sacrificeSelf())
            .condition(context => !!(this.game.isDuringConflict() && context.source.parentCharacter && context.source.parentCharacter.isParticipating()))
            .gameAction(ability.actions.cardLastingEffect((context) => ({
                target: context.game.currentConflict?.getParticipants().filter((card: DrawCard) => !card.isUnique()) ?? [],
                effect: ability.effects.modifyMilitarySkill(-2)
            })))
            .effect('give all non-unique participating characters -2{1}', () => ['military']);
    }
}


export default Smoke;
