import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class WanderingRonin extends DrawCard {
    static id = 'wandering-ronin';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Give this character +2/+2')
            .cost(ability.costs.removeFateFromSelf())
            .condition(() => this.game.isDuringConflict())
            .gameAction(ability.actions.cardLastingEffect({ effect: ability.effects.modifyBothSkills(2) }))
            .effect('give himself +2{1}/+2{2}', () => ['military', 'political'])
            .limit(ability.limit.perConflict(2));
    }
}


export default WanderingRonin;
