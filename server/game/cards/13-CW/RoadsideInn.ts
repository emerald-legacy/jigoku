import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { placeFate } from '../../GameActions/GameActions.js';
import { Players, CardType, Phase } from '../../Constants.js';
import { honorTransferMessage } from '../honorTransferMessage.js';

class RoadsideInn extends DrawCard {
    static id = 'roadside-inn';

    setupCardAbilities() {
        this.reaction('Place a fate on a character')
            .when({
                onPhaseStarted: event => event.phase === Phase.Fate
            })
            .cost(costs.optionalTakeHonorFromOpponent(context => {
                return (context.player.opponent?.fate ?? 0) > 0;
            }))
            .target({
                name: 'myCharacter',
                cardType: CardType.Character
            }, placeFate(context => ({ origin: context.player })))
            .target({
                name: 'oppCharacter',
                player: Players.Opponent,
                cardType: CardType.Character,
                optional: true,
                hideIfNoLegalTargets: true,
                cardCondition: (_card, context) => Boolean(context.costs.honorTakenFromOpponent)
            }, placeFate(context => ({ origin: context.player.opponent })))
            .chatText('place a fate from their pool on {1}{2}', (context) => [
                context.targets.myCharacter,
                honorTransferMessage(context, context.targets.oppCharacter, (name) => 'place a fate from their pool on ' + name)
            ]);
    }
}


export default RoadsideInn;
