import { Players, CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { bow } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class DojiGiftGiver extends DrawCard {
    static id = 'doji-gift-giver';

    setupCardAbilities() {
        this.action('Bow a character')
            .cost(costs.giveFateToOpponent(1))
            .condition((context) => context.source.isParticipating() && context.player.opponent !== undefined)
            .target({
                player: Players.Opponent,
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating() && !card.bowed
            }, bow());
    }
}
