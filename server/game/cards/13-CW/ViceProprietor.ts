import { CardType, Players } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { bow } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class ViceProprietor extends DrawCard {
    static id = 'vice-proprietor';

    public override setupCardAbilities() {
        this.action('Bow a character')
            .condition((context) => context.source.isParticipating() && context.player.opponent !== undefined)
            .cost(costs.dishonorSelf())
            .target({
                player: Players.Opponent,
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, bow());
    }
}
