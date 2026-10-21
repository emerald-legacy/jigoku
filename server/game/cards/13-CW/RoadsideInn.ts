import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { placeFate } from '../../GameActions/GameActions.js';
import { Players, CardType, Phase } from '../../Constants.js';
import { honorTransferMessage } from '../honorTransferMessage.js';

class RoadsideInn extends DrawCard {
    static id = 'roadside-inn';

    override setupCardAbilities() {
        this.reaction('Place a fate on a character')
            .when({
                onPhaseStarted: (event) => event.phase === Phase.Fate
            })
            // it must be able to move some fate
            .condition((context) => context.player.fate > 0 || (context.player.opponent?.fate ?? 0) > 0)
            .cost(costs.optionalTakeHonorFromOpponent((context) => {
                return (context.player.opponent?.fate ?? 0) > 0;
            }))
            // "if able" covers the fate move, not the choice: you choose even with no fate
            .target({
                name: 'myCharacter',
                cardType: CardType.Character
            })
            .target({
                name: 'oppCharacter',
                player: Players.Opponent,
                cardType: CardType.Character,
                optional: true,
                hideIfNoLegalTargets: true,
                cardCondition: (_card, context) => Boolean(context.costs.honorTakenFromOpponent)
            }, placeFate((context) => ({ origin: context.player.opponent })))
            .placeFate((context) => ({ origin: context.player, target: context.targets.myCharacter }))
            .firstPlayerChoosesFirst()
            .chatText((context) => msg`${context.player.fate > 0 ? 'place a fate from their pool on' : 'choose'} ${context.targets.myCharacter}${honorTransferMessage(context, context.targets.oppCharacter, (card) => msg`place a fate from their pool on ${card}`)}`);
    }
}


export default RoadsideInn;
