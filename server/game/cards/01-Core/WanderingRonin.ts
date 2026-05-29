import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class WanderingRonin extends DrawCard {
    static id = 'wandering-ronin';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Give this character +2/+2',
            condition: () => this.game.isDuringConflict(),
            cost: ability.costs.removeFateFromSelf(),
            effect: 'give himself +2{1}/+2{2}',
            effectArgs: () => ['military', 'political'],
            gameAction: ability.actions.cardLastingEffect({ effect: ability.effects.modifyBothSkills(2) }),
            limit: ability.limit.perConflict(2)
        });
    }
}


export default WanderingRonin;
