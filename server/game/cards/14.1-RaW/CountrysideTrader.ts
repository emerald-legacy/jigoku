import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { TargetMode, CardType, Location } from '../../Constants.js';

class CountrysideTrader extends DrawCard {
    static id = 'countryside-trader';

    setupCardAbilities() {
        this.action({
            title: 'Resolve the attacked province ability',
            cost: AbilityDsl.costs.payFate(1),
            condition: context => context.game.isDuringConflict() && context.source.isAttacking(),
            target: {
                activePromptTitle: 'Select a province to trigger from',
                mode: TargetMode.Ability,
                location: Location.Provinces,
                cardType: CardType.Province,
                cardCondition: card => card.isConflictProvince(),
                abilityCondition: ability => ability.printedAbility,
                gameAction: AbilityDsl.actions.resolveAbility(context => ({
                    target: context.targetAbility.card,
                    ability: context.targetAbility,
                    player: context.player,
                    ignoredRequirements: ['condition'],
                    choosingPlayerOverride: context.choosingPlayerOverride
                }))
            }
        });
    }
}


export default CountrysideTrader;
