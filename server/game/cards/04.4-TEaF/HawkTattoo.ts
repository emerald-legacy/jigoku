import { msg } from '../../GameChat.js';
import { addTrait, additionalAction } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { Duration } from '../../Constants.js';

class HawkTattoo extends DrawCard {
    static id = 'hawk-tattoo';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.whileAttached({
            effect: addTrait('tattooed')
        });

        this.reaction('Move attached character to the conflict')
            .when({
                onCardPlayed: (event, context) => context.source.parentCharacter && event.card === context.source && this.game.isDuringConflict()
            })
            .moveToConflict((context) => ({ target: context.source.parentCharacter ?? [] }))
            .playerLastingEffect((context) => ({
                targetController: context.player,
                duration: Duration.UntilPassPriority,
                effect: context.source.parentCharacter?.hasTrait('monk') ? additionalAction() : []
            }))
            .chatText((context) => msg`move ${context.source.parentCharacter} into the conflict${context.source.parentCharacter?.hasTrait('monk') ? ' and take an additional action' : ''}`);
    }
}


export default HawkTattoo;
