import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class IkomaUjiaki2 extends DrawCard {
    static id = 'ikoma-ujiaki-2';

    setupCardAbilities() {
        this.action('Switch the conflict type')
            .cost(AbilityDsl.costs.payHonor(2))
            .condition(context => context.source.isParticipating())
            .gameAction(AbilityDsl.actions.switchConflictType())
            .effect('switch the conflict type');
    }
}


export default IkomaUjiaki2;
