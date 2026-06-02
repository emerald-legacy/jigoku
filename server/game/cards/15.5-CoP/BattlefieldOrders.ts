import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Players, TargetMode, Location, AbilityType } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type CardAbility from '../../CardAbility.js';

class BattlefieldOrders extends DrawCard {
    static id = 'battlefield-orders';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            match: (player: any) => player.opponent && player.honor >= player.opponent.honor + 5,
            effect: AbilityDsl.effects.reduceCost({ match: (card: any, source: any) => card === source })
        });

        this.action({
            title: 'Resolve an ability',
            condition: (context: any) => context.game.isDuringConflict('military'),
            target: {
                activePromptTitle: 'Select an ability to resolve',
                mode: TargetMode.Ability,
                abilityCondition: (ability: any) => ability.abilityType === AbilityType.Action,
                cardType: CardType.Character,
                cardCondition: (card: any) => card.isParticipating(),
                controller: Players.Any,
                gameAction: AbilityDsl.actions.resolveAbility((context: AbilityContext) => ({
                    target: (context.targetAbility as CardAbility).card,
                    ability: context.targetAbility as CardAbility,
                    player: (context.targetAbility as CardAbility).card.controller,
                    ignoredRequirements: ['player'],
                    choosingPlayerOverride: context.choosingPlayerOverride ?? undefined
                }))
            },
            effect: 'trigger {1}\'s \'{2}\' ability',
            effectArgs: (context: AbilityContext) => [(context.targetAbility as CardAbility).card, (context.targetAbility as CardAbility).title as string]
        });
    }
}


export default BattlefieldOrders;
