import DrawCard from '../../drawcard.js';

class GuardianKami extends DrawCard {
    static id = 'guardian-kami';

    setupCardAbilities(ability) {
        this.action({
            title: 'Resolve ring effect',
            cost: ability.costs.sacrificeSelf(),
            max: ability.limit.perConflict(1),
            condition: context => context.source.isDefending(),
            gameAction: ability.actions.resolveConflictRing()
        });
    }
}


export default GuardianKami;
