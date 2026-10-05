import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class CurvedBlade extends DrawCard {
    static id = 'curved-blade';

    setupCardAbilities() {
        this.attachmentConditions({
            faction: 'unicorn'
        });

        this.whileAttached({
            condition: (context) => Boolean(context.source.parentCharacter && context.source.parentCharacter.isAttacking()),
            effect: AbilityDsl.effects.modifyMilitarySkill(2)
        });
    }
}


export default CurvedBlade;
