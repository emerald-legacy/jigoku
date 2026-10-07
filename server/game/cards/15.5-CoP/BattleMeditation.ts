import DrawCard from '../../DrawCard.js';
import { perConflict } from '../../AbilityLimit.js';
import { draw } from '../../GameActions/GameActions.js';

class BattleMeditation extends DrawCard {
    static id = 'battle-meditation';

    setupCardAbilities() {
        this.reaction('draw 3 cards')
            .when({
                onBreakProvince: (event, context) => event.card.owner !== context.player
                    && (context.game.currentConflict?.getParticipants().some(p => p.controller === context.player && p.hasTrait('berserker')) ?? false)
            })
            .gameAction(draw({
                amount: 3
            }))
            .max(perConflict(1));
    }
}


export default BattleMeditation;
