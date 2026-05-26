import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';
import { CardTypes, EventNames } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class GloriousVictory extends DrawCard {
    static id = 'glorious-victory';

    setupCardAbilities() {
        this.reaction({
            title: 'Honor each character you control',
            when: {
                onBreakProvince: (event: EventPayload<EventNames.OnBreakProvince>, context: AbilityContext) =>
                    this.game.isDuringConflict('military') && !!event.conflict && event.conflict.attackingPlayer === context.player
            },
            gameAction: AbilityDsl.actions.honor((context: AbilityContext) => ({
                target: context.player.filterCardsInPlay((card: any) => card.getType() === CardTypes.Character)
            }))
        });
    }
}


export default GloriousVictory;
