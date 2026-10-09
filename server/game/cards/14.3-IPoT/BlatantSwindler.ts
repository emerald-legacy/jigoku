import { Players, CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { sendHome } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class BlatantSwindler extends DrawCard {
    static id = 'blatant-swindler';

    public setupCardAbilities() {
        this.action('Move home a character')
            .cost(costs.giveHonorToOpponent(1))
            .condition((context) => context.source.isParticipating() && context.player.opponent !== undefined)
            .target({
                player: Players.Opponent,
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, sendHome());
    }
}
