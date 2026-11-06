import { Players, CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { bow } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class DojiGiftGiver extends DrawCard {
    static id = 'doji-gift-giver';

    override setupCardAbilities() {
        this.action('Bow a character')
            .condition((context) => context.source.isParticipating() && context.player.opponent !== undefined)
            .cost(costs.giveFateToOpponent(1))
            .target({
                player: Players.Opponent,
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating() && !card.bowed
            }, bow());
    }
}
