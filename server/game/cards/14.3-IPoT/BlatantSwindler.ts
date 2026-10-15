import { Players, CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { sendHome } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class BlatantSwindler extends DrawCard {
    static id = 'blatant-swindler';

    public override setupCardAbilities() {
        this.action('Move home a character')
            .condition((context) => context.source.isParticipating() && context.player.opponent !== undefined)
            .cost(costs.giveHonorToOpponent(1))
            .target({
                player: Players.Opponent,
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, sendHome());
    }
}
