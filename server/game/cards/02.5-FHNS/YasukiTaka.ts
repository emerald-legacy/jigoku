import DrawCard from '../../drawcard.js';
import { Phases, CardTypes, Locations } from '../../Constants.js';

class YasukiTaka extends DrawCard {
    static id = 'yasuki-taka';

    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain fate',
            when: {
                onCardLeavesPlay: event => this.game.currentPhase === Phases.Conflict && event.cardStateWhenLeftPlay.isFaction('crab') > 0 &&
                                           event.cardStateWhenLeftPlay.type === CardTypes.Character && event.cardStateWhenLeftPlay.location === Locations.PlayArea
            },
            limit: ability.limit.perPhase(Infinity),
            gameAction: ability.actions.gainFate()
        });
    }
}


export default YasukiTaka;
