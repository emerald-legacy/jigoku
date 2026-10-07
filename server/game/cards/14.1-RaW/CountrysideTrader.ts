import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { resolveAbility } from '../../GameActions/GameActions.js';
import { CardType, Location } from '../../Constants.js';

class CountrysideTrader extends DrawCard {
    static id = 'countryside-trader';

    setupCardAbilities() {
        this.action('Resolve the attacked province ability')
            .cost(costs.payFate(1))
            .condition(context => context.game.isDuringConflict() && context.source.isAttacking())
            .abilityTarget({
                activePromptTitle: 'Select a province to trigger from',
                location: Location.Provinces,
                cardType: CardType.Province,
                cardCondition: card => card.isConflictProvince(),
                abilityCondition: ability => ability.printedAbility
            }, resolveAbility((context) => ({
                target: context.targetAbility?.card,
                ability: context.targetAbility,
                player: context.player,
                ignoredRequirements: ['condition'],
                choosingPlayerOverride: context.choosingPlayerOverride
            })));
    }
}


export default CountrysideTrader;
