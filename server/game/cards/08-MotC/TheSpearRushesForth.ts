import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { bow } from '../../GameActions/GameActions.js';
import { CardType, Players, ConflictType } from '../../Constants.js';

class TheSpearRushesForth extends DrawCard {
    static id = 'the-spear-rushes-forth';

    override setupCardAbilities() {
        this.action('Bow a participating character')
            .condition(() => this.game.isDuringConflict(ConflictType.Military))
            .cost(costs.discardHonoredToken({
                cardCondition: (card) => card.isHonored && card.isDrawCard() && card.isParticipating()
            }))
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, bow());
    }
}


export default TheSpearRushesForth;
