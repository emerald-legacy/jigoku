import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Phases, EventName } from '../../Constants.js';

class StarryHeavenSanctuary extends DrawCard {
    static id = 'starry-heaven-sanctuary';

    setupCardAbilities() {
        this.reaction('Gain 2 fate')
            .aggregateWhen((events, context) =>
                context.game.currentPhase === Phases.Fate &&
                events.reduce((total, event) => total + (event.is(EventName.OnMoveFate) ? event.fate ?? 0 : 0), 0) >=
                    4)
            .gameAction(AbilityDsl.actions.gainFate({ amount: 2 }))
            .effect('gain 2 fate');
    }
}


export default StarryHeavenSanctuary;
