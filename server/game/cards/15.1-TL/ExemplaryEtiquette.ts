import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Durations } from '../../Constants.js';

class ExemplaryEtiquette extends DrawCard {
    static id = 'exemplary-etiquette';

    setupCardAbilities() {
        this.action({
            title: 'Stop characters from triggering abilities',
            condition: () => this.game.isDuringConflict(),
            gameAction: AbilityDsl.actions.conflictLastingEffect({
                duration: Durations.UntilEndOfConflict,
                effect: AbilityDsl.effects.charactersCannot({
                    cannot: 'triggerAbilities'
                })
            }),
            effect: 'make it so that characters cannot trigger abilities this conflict'
        });
    }
}


export default ExemplaryEtiquette;
