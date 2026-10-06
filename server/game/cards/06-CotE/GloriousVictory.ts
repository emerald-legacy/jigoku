import { honor } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { CardType, ConflictType } from '../../Constants.js';

class GloriousVictory extends DrawCard {
    static id = 'glorious-victory';

    setupCardAbilities() {
        this.reaction('Honor each character you control')
            .when({
                onBreakProvince: (event, context) =>
                    this.game.isDuringConflict(ConflictType.Military) && !!event.conflict && event.conflict.attackingPlayer === context.player
            })
            .gameAction(honor((context) => ({
                target: context.player.filterCardsInPlay((card) => card.getType() === CardType.Character)
            })));
    }
}


export default GloriousVictory;
