import { Trait } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { addTrait } from '../../effects.js';

class ShadowSteed extends DrawCard {
    static id = 'shadow-steed';

    override setupCardAbilities() {
        this.whileAttached({
            effect: addTrait(Trait.Cavalry)
        });

        this.action('Ready attached character')
            .condition((context) => !!(context.source.parentCharacter && context.source.parentCharacter.getFate() === 0))
            .cost(costs.payHonor(1))
            .ready((context) => ({target: context.source.parentCharacter ?? []}));
    }

    override isTemptationsMaho() {
        return true;
    }
}


export default ShadowSteed;

