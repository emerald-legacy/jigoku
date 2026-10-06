import { CardType, Duration } from '../../../Constants.js';
import { cannotTriggerAbilities } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class DaidojiSaboteur extends DrawCard {
    static id = 'daidoji-saboteur';

    setupCardAbilities() {
        this.reaction('Disable a character')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source
            })
            .target({
                cardType: CardType.Character
            }, cardLastingEffect({
                effect: cannotTriggerAbilities(),
                duration: Duration.UntilEndOfPhase
            }))
            .effect('prevent {0} from using any abilities for the rest of the phase');
    }
}
