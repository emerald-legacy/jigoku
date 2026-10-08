import { addTrait, additionalAction } from '../../effects.js';
import { moveToConflict, playerLastingEffect } from '../../GameActions/GameActions.js';
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
            .gameAction(moveToConflict((context) => ({ target: context.source.parentCharacter ?? [] })), playerLastingEffect((context) => ({
                targetController: context.player,
                duration: Duration.UntilPassPriority,
                effect: context.source.parentCharacter?.hasTrait('monk') ? additionalAction() : []
            })))
            .chatText('move {1} into the conflict{2}', (context) => [context.source.parentCharacter, context.source.parentCharacter?.hasTrait('monk') ? ' and take an additional action' : '']);
    }
}


export default HawkTattoo;
