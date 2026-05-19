import DrawCard from '../../drawcard.js';
import { Locations } from '../../Constants.js';

class WrathOfTheKami extends DrawCard {
    static id = 'the-wrath-of-the-kami';

    setupCardAbilities(ability) {
        this.action({
            title: 'Add Province Strength',
            condition: context => this.game.isDuringConflict() && context.source.isInConflictProvince(),
            cost: ability.costs.payHonor(1),
            limit: ability.limit.unlimitedPerConflict(),
            effect: 'add 1 to the province strength of {1}',
            // @ts-expect-error effectArgs returns BaseCard[] but EffectArg union doesn't include BaseCard - game engine handles it
            effectArgs: context => [context.source.controller.getProvinceCardInProvince(context.source.location)],
            gameAction: ability.actions.cardLastingEffect(context => ({
                target: context.source.controller.getProvinceCardInProvince(context.source.location),
                targetLocation: Locations.Provinces,
                effect: ability.effects.modifyProvinceStrength(1)
            }))
        });
    }
}


export default WrathOfTheKami;
