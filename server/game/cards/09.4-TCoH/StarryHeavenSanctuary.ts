import DrawCard from '../../DrawCard.js';
import { Phase, EventName } from '../../Constants.js';

class StarryHeavenSanctuary extends DrawCard {
    static id = 'starry-heaven-sanctuary';

    setupCardAbilities() {
        this.reaction('Gain 2 fate')
            .aggregateWhen((events, context) =>
                context.game.currentPhase === Phase.Fate &&
                events.reduce((total, event) => total + (event.is(EventName.OnMoveFate) ? event.fate ?? 0 : 0), 0) >=
                    4)
            .gainFate(2)
            .effect('gain 2 fate');
    }
}


export default StarryHeavenSanctuary;
