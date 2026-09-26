import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Phases, CardType, Location } from '../../Constants.js';

class YasukiTaka extends DrawCard {
    static id = 'yasuki-taka';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction('Gain fate')
            .when({
                onCardLeavesPlay: event => {
                    const state = event.cardStateWhenLeftPlay;
                    return this.game.currentPhase === Phases.Conflict && !!state && state.isFaction('crab') &&
                        state.type === CardType.Character && state.location === Location.PlayArea;
                }
            })
            .gameAction(ability.actions.gainFate())
            .limit(ability.limit.perPhase(Infinity));
    }
}


export default YasukiTaka;
