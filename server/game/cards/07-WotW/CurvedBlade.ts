import DrawCard from '../../drawcard.js';

class CurvedBlade extends DrawCard {
    static id = 'curved-blade';

    setupCardAbilities(ability) {
        this.attachmentConditions({
            faction: 'unicorn'
        });

        this.whileAttached({
            condition: context => context.source.parent && context.source.parent.isAttacking(),
            effect: ability.effects.modifyMilitarySkill(2)
        });
    }
}


export default CurvedBlade;
