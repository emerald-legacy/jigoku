import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { resolveAbility } from '../../GameActions/GameActions.js';
import { CardType, Location, Blocker } from '../../Constants.js';

class CountrysideTrader extends DrawCard {
    static id = 'countryside-trader';

    override setupCardAbilities() {
        this.action('Resolve the attacked province ability')
            .condition((context) => context.game.isDuringConflict() && context.source.isAttacking())
            .cost(costs.payFate(1))
            .abilityTarget({
                activePromptTitle: 'Select a province to trigger from',
                location: Location.Provinces,
                cardType: CardType.Province,
                cardCondition: (card) => card.isConflictProvince(),
                printedOn: true
            }, resolveAbility((context) => ({
                target: context.targetAbility?.card,
                ability: context.targetAbility,
                player: context.player,
                ignoredBlockers: [Blocker.ConditionNotMet, Blocker.IfConditionNotMet],
                choosingPlayerOverride: context.choosingPlayerOverride
            })));
    }
}


export default CountrysideTrader;
