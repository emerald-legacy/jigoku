import DrawCard from '../../DrawCard.js';
import { Players, CardType, Phases } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class DaidojiNetsu extends DrawCard {
    static id = 'daidoji-netsu';

    setupCardAbilities() {
        this.persistentEffect({
            condition: () => this.game.currentPhase === Phases.Conflict,
            targetController: Players.Any,
            match: (card, context) => card.getType() === CardType.Character && card !== context?.source,
            effect: [
                AbilityDsl.effects.cardCannot({
                    cannot: 'leavePlay',
                    restricts: 'nonKeywordAbilities'})
            ]
        });
    }
}


export default DaidojiNetsu;

