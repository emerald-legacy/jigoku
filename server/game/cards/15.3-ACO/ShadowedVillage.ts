import DrawCard from '../../DrawCard.js';
import { CardTypes, EventNames, Phases } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class ShadowedVillage extends DrawCard {
    static id = 'shadowed-village';

    setupCardAbilities() {
        this.reaction({
            title: 'Draw cards',
            when: {
                onMoveFate: (event: EventPayload<EventNames.OnMoveFate>, context: any) =>
                    context.game.currentPhase !== Phases.Fate &&
                    event.origin &&
                    event.origin.type === CardTypes.Character &&
                    'controller' in event.origin &&
                    event.origin.controller === context.player &&
                    event.fate > 0
            },
            effect: 'draw {1} card{2}',
            effectArgs: (context) => (context.event.origin.isDishonored ? ['2', 's'] : ['a', '']),
            gameAction: AbilityDsl.actions.draw((context) => ({
                target: context.player,
                amount: context.event.origin.isDishonored ? 2 : 1
            }))
        });
    }
}


export default ShadowedVillage;
