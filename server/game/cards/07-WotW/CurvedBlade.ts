import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';

class CurvedBlade extends DrawCard {
    static id = 'curved-blade';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.attachmentConditions({
            faction: 'unicorn'
        });

        this.whileAttached({
            condition: (context: AbilityContext) => Boolean(context.source.parent && context.source.parent.isAttacking()),
            effect: ability.effects.modifyMilitarySkill(2)
        });
    }
}


export default CurvedBlade;
