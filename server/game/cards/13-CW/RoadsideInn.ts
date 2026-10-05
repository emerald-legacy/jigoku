import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, CardType, Phases } from '../../Constants.js';
import { honorTransferMessage } from '../honorTransferMessage.js';

class RoadsideInn extends DrawCard {
    static id = 'roadside-inn';

    setupCardAbilities() {
        this.reaction('Place a fate on a character')
            .when({
                onPhaseStarted: event => event.phase === Phases.Fate
            })
            .cost(AbilityDsl.costs.optionalHonorTransferFromOpponentCost(context => {
                return (context.player.opponent?.fate ?? 0) > 0;
            }))
            .target({
                name: 'myCharacter',
                cardType: CardType.Character
            }, AbilityDsl.actions.placeFate(context => ({ origin: context.player })))
            .target({
                name: 'oppCharacter',
                player: Players.Opponent,
                cardType: CardType.Character,
                optional: true,
                hideIfNoLegalTargets: true,
                cardCondition: (card, context) => Boolean(context.costs.optionalHonorTransferFromOpponentCostPaid)
            }, AbilityDsl.actions.placeFate(context => ({ origin: context.player.opponent })))
            .effect('place a fate from their pool on {1}{2}', (context) => [
                context.targets.myCharacter,
                honorTransferMessage(context, context.targets.oppCharacter, (name) => 'place a fate from their pool on ' + name, (card) => card.controller)
            ]);
    }
}


export default RoadsideInn;
