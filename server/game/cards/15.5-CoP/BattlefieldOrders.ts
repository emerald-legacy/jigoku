import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, Players, TargetModes, Locations, AbilityTypes } from '../../Constants.js';

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
                gameAction: AbilityDsl.actions.resolveAbility((context: any) => ({
                    target: context.targetAbility.card,
                    ability: context.targetAbility,
                    player: context.targetAbility.card.controller,
                    ignoredRequirements: ['player'],
                    choosingPlayerOverride: context.choosingPlayerOverride
                }))
            },
            effect: 'trigger {1}\'s \'{2}\' ability',
            effectArgs: (context: any) => [context.targetAbility.card, context.targetAbility.title]
        });
    }
}


export default BattlefieldOrders;
