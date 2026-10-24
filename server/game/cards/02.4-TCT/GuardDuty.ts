import DrawCard from '../../DrawCard.js';

class GuardDuty extends DrawCard {
    static id = 'guard-duty';

    override setupCardAbilities() {
        this.action('Honor this character')
            .ifCondition((context) => !!(context.source.parentCharacter && context.source.parentCharacter.isDefending()))
            .honor((context) => ({ target: context.source.parentCharacter ?? [] }));
    }
}


export default GuardDuty;
