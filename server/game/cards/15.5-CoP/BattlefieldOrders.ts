import DrawCard from '../../DrawCard.js';
import { reduceCost } from '../../effects.js';
import { resolveAbility } from '../../GameActions/GameActions.js';
import { CardType, Players, Location, AbilityType, ConflictType, Blocker } from '../../Constants.js';
import { msg } from '../../GameChat.js';

class BattlefieldOrders extends DrawCard {
    static id = 'battlefield-orders';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            match: (player) => !!player.opponent && player.honor >= player.opponent.honor + 5,
            effect: reduceCost({ match: (card, source) => card === source })
        });

        this.conflictAction('Resolve an ability', { conflictType: ConflictType.Military })
            .abilityTarget({
                activePromptTitle: 'Select an ability to resolve',
                abilityCondition: (ability) => ability.abilityType === AbilityType.Action,
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating(),
                controller: Players.Any
            }, resolveAbility((context) => ({
                target: context.targetAbility.card,
                ability: context.targetAbility,
                player: context.targetAbility.card.controller,
                ignoredBlockers: [Blocker.WrongPlayer],
                choosingPlayerOverride: context.choosingPlayerOverride ?? undefined
            })))
            .chatText((context) => msg`trigger ${context.targetAbility.card}'s '${context.targetAbility.title}' ability`);
    }
}


export default BattlefieldOrders;
