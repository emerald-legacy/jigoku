import DrawCard from '../../drawcard.js';

class KamiUnleashed extends DrawCard {
    static id = 'kami-unleashed';

    setupCardAbilities(ability) {
        this.action({
            title: 'Resolve ring effect',
            cost: ability.costs.sacrificeSelf(),
            max: ability.limit.perConflict(1),
            condition: context => context.source.isAttacking(),
            gameAction: ability.actions.resolveConflictRing()
        });
    }
}


export default KamiUnleashed;
