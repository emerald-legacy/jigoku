import { CardTypes, Durations } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class DaidojiSaboteur extends DrawCard {
    static id = 'daidoji-saboteur';

    setupCardAbilities() {
        this.reaction({
            title: 'Disable a character',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    effect: AbilityDsl.effects.cardCannot('triggerAbilities'),
                    duration: Durations.UntilEndOfPhase
                })
            },
            effect: 'prevent {0} from using any abilities for the rest of the phase'
        });
    }
}
