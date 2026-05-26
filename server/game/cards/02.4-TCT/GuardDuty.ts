import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class GuardDuty extends DrawCard {
    static id = 'guard-duty';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Honor this character',
            condition: context => context.source.parent && context.source.parent.isDefending(),
            gameAction: ability.actions.honor(context => ({ target: context.source.parent }))
        });
    }
}


export default GuardDuty;
