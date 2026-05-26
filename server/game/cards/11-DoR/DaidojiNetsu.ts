import DrawCard from '../../drawcard.js';
import { Players, CardTypes, Phases } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class DaidojiNetsu extends DrawCard {
    static id = 'daidoji-netsu';

    setupCardAbilities() {
        this.persistentEffect({
            condition: () => this.game.currentPhase === Phases.Conflict,
            targetController: Players.Any,
            match: (card, context) => card.getType() === CardTypes.Character && card !== context?.source,
            effect: [
                AbilityDsl.effects.cardCannot({
                    cannot: 'leavePlay',
                    restricts: 'nonKeywordAbilities'})
            ]
        });
    }
}


export default DaidojiNetsu;

