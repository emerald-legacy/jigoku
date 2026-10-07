import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { addTrait } from '../../effects.js';

class ShadowSteed extends DrawCard {
    static id = 'shadow-steed';

    setupCardAbilities() {
        this.whileAttached({
            effect: addTrait('cavalry')
        });

        this.action('Ready attached character')
            .cost(costs.payHonor(1))
            .condition(context => !!(context.source.parentCharacter && context.source.parentCharacter.getFate() === 0))
            .ready(context => ({target: context.source.parentCharacter ?? []}));
    }

    isTemptationsMaho() {
        return true;
    }
}


export default ShadowSteed;

