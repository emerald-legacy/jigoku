import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class GuardDuty extends DrawCard {
    static id = 'guard-duty';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Honor this character',
            condition: context => !!(context.source.attachedCharacter && context.source.attachedCharacter.isDefending()),
            gameAction: ability.actions.honor(context => ({ target: context.source.attachedCharacter }))
        });
    }
}


export default GuardDuty;
