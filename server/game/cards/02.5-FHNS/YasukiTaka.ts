import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Phases, CardType, Location } from '../../Constants.js';

class YasukiTaka extends DrawCard {
    static id = 'yasuki-taka';

    setupCardAbilities() {
        this.reaction('Gain fate')
            .when({
                onCardLeavesPlay: event => {
                    const state = event.cardStateWhenLeftPlay;
                    return this.game.currentPhase === Phases.Conflict && !!state && state.isFaction('crab') &&
                        state.type === CardType.Character && state.location === Location.PlayArea;
                }
            })
            .gameAction(AbilityDsl.actions.gainFate())
            .limit(AbilityDsl.limit.perPhase(Infinity));
    }
}


export default YasukiTaka;
