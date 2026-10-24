import DrawCard from '../../DrawCard.js';
import { CardType, ConflictType } from '../../Constants.js';

class GloriousVictory extends DrawCard {
    static id = 'glorious-victory';

    override setupCardAbilities() {
        this.reaction('Honor each character you control')
            .when({
                onBreakProvince: (event, context) =>
                    this.game.isDuringConflict(ConflictType.Military) && event.breaker === context.player
            })
            .honor((context) => ({
                target: context.player.filterCardsInPlay((card) => card.type === CardType.Character)
            }));
    }
}


export default GloriousVictory;
