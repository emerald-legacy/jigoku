import BaseCard from '../../BaseCard.js';
import DrawCard from '../../DrawCard.js';
import { CardType, EventName, Phases } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class ShadowedVillage extends DrawCard {
    static id = 'shadowed-village';

    setupCardAbilities() {
        this.reaction('Draw cards')
            .when({
                onMoveFate: (event: EventPayload<EventName.OnMoveFate>, context) =>
                    context.game.currentPhase !== Phases.Fate &&
                    event.origin &&
                    event.origin.type === CardType.Character &&
                    'controller' in event.origin &&
                    event.origin.controller === context.player &&
                    (event.fate ?? 0) > 0
            })
            .gameAction(AbilityDsl.actions.draw((context) => ({
                target: context.player,
                amount: context.event.origin instanceof BaseCard && context.event.origin.isDishonored ? 2 : 1
            })))
            .effect('draw {1} card{2}', (context) => (context.event.origin instanceof BaseCard && context.event.origin.isDishonored ? ['2', 's'] : ['a', '']));
    }
}


export default ShadowedVillage;
