import AbilityDsl from '../../abilitydsl.js';
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
            .gameAction(AbilityDsl.actions.honor((context) => ({
                target: context.player.filterCardsInPlay((card) => card.getType() === CardType.Character)
            })));
    }
}


export default GloriousVictory;
