import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Phases, EventName } from '../../Constants.js';
import type { GameEvent } from '../../Events/EventPayloads.js';

class StarryHeavenSanctuary extends DrawCard {
    static id = 'starry-heaven-sanctuary';

    setupCardAbilities() {
        this.reaction({
            title: 'Gain 2 fate',
            aggregateWhen: (events, context) =>
                context.game.currentPhase === Phases.Fate &&
                events.reduce((total, event) => total + (event.name === EventName.OnMoveFate ? (event as GameEvent<EventName.OnMoveFate>).fate : 0), 0) >=
                    4,
            effect: 'gain 2 fate',
            gameAction: AbilityDsl.actions.gainFate({ amount: 2 })
        });
    }
}


export default StarryHeavenSanctuary;
