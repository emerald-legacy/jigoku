import DrawCard from '../../DrawCard.js';
import { charactersCannot } from '../../effects.js';
import { conflictLastingEffect } from '../../GameActions/GameActions.js';
import { RestrictionType } from '../../Constants.js';

class ExemplaryEtiquette extends DrawCard {
    static id = 'exemplary-etiquette';

    setupCardAbilities() {
        this.conflictAction('Stop characters from triggering abilities')
            .gameAction(conflictLastingEffect({
                effect: charactersCannot({
                    cannot: RestrictionType.TriggerAbilities
                })
            }))
            .chatText('make it so that characters cannot trigger abilities this conflict');
    }
}


export default ExemplaryEtiquette;
