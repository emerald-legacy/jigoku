import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType, EventName } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class GloriousVictory extends DrawCard {
    static id = 'glorious-victory';

    setupCardAbilities() {
        this.reaction({
            title: 'Honor each character you control',
            when: {
                onBreakProvince: (event: EventPayload<EventName.OnBreakProvince>, context: AbilityContext) =>
                    this.game.isDuringConflict('military') && !!event.conflict && event.conflict.attackingPlayer === context.player
            },
            gameAction: AbilityDsl.actions.honor((context: AbilityContext) => ({
                target: context.player.filterCardsInPlay((card: any) => card.getType() === CardType.Character)
            }))
        });
    }
}


export default GloriousVictory;
