import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class IkomaUjiaki2 extends DrawCard {
    static id = 'ikoma-ujiaki-2';

    setupCardAbilities() {
        this.action({
            title: 'Switch the conflict type',
            condition: context => context.source.isParticipating(),
            cost: AbilityDsl.costs.payHonor(2),
            effect: 'switch the conflict type',
            gameAction: AbilityDsl.actions.switchConflictType()
        });
    }
}


export default IkomaUjiaki2;
