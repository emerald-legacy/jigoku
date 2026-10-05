import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';

class WrathOfTheKami extends DrawCard {
    static id = 'the-wrath-of-the-kami';

    setupCardAbilities() {
        this.action('Add Province Strength')
            .cost(AbilityDsl.costs.payHonor(1))
            .condition(context => this.game.isDuringConflict() && context.source.isInConflictProvince())
            .gameAction(AbilityDsl.actions.cardLastingEffect(context => ({
                target: context.source.controller.getProvinceCardInProvince(context.source.location),
                targetLocation: Location.Provinces,
                effect: AbilityDsl.effects.modifyProvinceStrength(1)
            })))
            .effect('add 1 to the province strength of {1}', context => [context.source.controller.getProvinceCardInProvince(context.source.location)])
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }
}


export default WrathOfTheKami;
