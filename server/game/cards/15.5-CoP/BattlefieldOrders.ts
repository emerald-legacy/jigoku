import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, Players, TargetModes, Locations, AbilityTypes } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type CardAbility from '../../CardAbility.js';

class BattlefieldOrders extends DrawCard {
    static id = 'battlefield-orders';

    setupCardAbilities() {
        this.persistentEffect({
            location: Locations.Any,
            targetController: Players.Any,
            match: (player: any) => player.opponent && player.honor >= player.opponent.honor + 5,
            effect: AbilityDsl.effects.reduceCost({ match: (card: any, source: any) => card === source })
        });

        this.action({
            title: 'Resolve an ability',
            condition: (context: any) => context.game.isDuringConflict('military'),
            target: {
                activePromptTitle: 'Select an ability to resolve',
                mode: TargetModes.Ability,
                abilityCondition: (ability: any) => ability.abilityType === AbilityTypes.Action,
                cardType: CardTypes.Character,
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
