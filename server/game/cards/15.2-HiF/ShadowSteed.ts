import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class ShadowSteed extends DrawCard {
    static id = 'shadow-steed';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.addTrait('cavalry')
        });

        this.action({
            title: 'Ready attached character',
            condition: context => !!(context.source.parentCharacter && context.source.parentCharacter.getFate() === 0),
            cost: AbilityDsl.costs.payHonor(1),
            gameAction: AbilityDsl.actions.ready(context => ({target: context.source.parentCharacter}))
        });
    }

    isTemptationsMaho() {
        return true;
    }
}


export default ShadowSteed;

