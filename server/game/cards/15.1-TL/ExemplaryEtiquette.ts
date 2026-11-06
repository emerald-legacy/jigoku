import DrawCard from '../../DrawCard.js';
import { charactersCannot } from '../../effects.js';
import { RestrictionScope, RestrictionType } from '../../Constants.js';

class ExemplaryEtiquette extends DrawCard {
    static id = 'exemplary-etiquette';

    override setupCardAbilities() {
        this.action('Stop characters from triggering abilities')
            .condition((context) => context.game.isDuringConflict())
            .conflictLastingEffect({
                effect: charactersCannot({
                    cannot: RestrictionType.TriggerAbilities,
                    appliesTo: [RestrictionScope.Characters, RestrictionScope.NonForcedAbilities]
                })
            })
            .chatText('make it so that characters cannot trigger abilities this conflict');
    }
}


export default ExemplaryEtiquette;
