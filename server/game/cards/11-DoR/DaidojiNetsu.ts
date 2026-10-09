import DrawCard from '../../DrawCard.js';
import { Players, CardType, Phase, RestrictionType, RestrictionScope } from '../../Constants.js';
import { cardCannot } from '../../effects.js';

class DaidojiNetsu extends DrawCard {
    static id = 'daidoji-netsu';

    setupCardAbilities() {
        this.persistentEffect({
            condition: () => this.game.currentPhase === Phase.Conflict,
            targetController: Players.Any,
            match: (card, context) => card.getType() === CardType.Character && card !== context?.source,
            effect: [
                cardCannot({
                    cannot: RestrictionType.LeavePlay,
                    appliesTo: RestrictionScope.NonKeywordAbilities})
            ]
        });
    }
}


export default DaidojiNetsu;

