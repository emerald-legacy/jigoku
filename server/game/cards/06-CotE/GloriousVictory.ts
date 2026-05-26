import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class GloriousVictory extends DrawCard {
    static id = 'glorious-victory';

    setupCardAbilities() {
        this.reaction({
            title: 'Honor each character you control',
            when: {
                onBreakProvince: (event: any, context: AbilityContext) =>
                    this.game.isDuringConflict('military') && !!event.conflict && event.conflict.attackingPlayer === context.player
            },
            gameAction: AbilityDsl.actions.honor((context: AbilityContext) => ({
                target: context.player.filterCardsInPlay((card: any) => card.getType() === CardTypes.Character)
            }))
        });
    }
}


export default GloriousVictory;
