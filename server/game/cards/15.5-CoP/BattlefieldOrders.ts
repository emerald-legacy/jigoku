import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Players, Location, AbilityType } from '../../Constants.js';
import type Player from '../../Player.js';

class BattlefieldOrders extends DrawCard {
    static id = 'battlefield-orders';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            match: (player: Player) => !!player.opponent && player.honor >= player.opponent.honor + 5,
            effect: AbilityDsl.effects.reduceCost({ match: (card, source) => card === source })
        });

        this.action('Resolve an ability')
            .condition(context => context.game.isDuringConflict('military'))
            .abilityTarget('target', {
                activePromptTitle: 'Select an ability to resolve',
                abilityCondition: ability => ability.abilityType === AbilityType.Action,
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating(),
                controller: Players.Any
            }, AbilityDsl.actions.resolveAbility((context) => ({
                target: (context.targetAbility).card,
                ability: context.targetAbility,
                player: (context.targetAbility).card.controller,
                ignoredRequirements: ['player'],
                choosingPlayerOverride: context.choosingPlayerOverride ?? undefined
            })))
            .effect('trigger {1}\'s \'{2}\' ability', (context) => [(context.targetAbility).card, (context.targetAbility).title]);
    }
}


export default BattlefieldOrders;
