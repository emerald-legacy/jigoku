import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { bow } from '../../GameActions/GameActions.js';
import { CardType, Players, ConflictType } from '../../Constants.js';

class TheSpearRushesForth extends DrawCard {
    static id = 'the-spear-rushes-forth';

    setupCardAbilities() {
        this.action('Bow a participating character')
            .cost(costs.discardStatusToken({
                cardCondition: (card) => card.isHonored && card.isDrawCard() && card.isParticipating()
            }))
            .condition(() => this.game.isDuringConflict(ConflictType.Military))
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, bow());
    }
}


export default TheSpearRushesForth;
