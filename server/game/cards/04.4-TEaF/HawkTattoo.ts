import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Duration } from '../../Constants.js';

class HawkTattoo extends DrawCard {
    static id = 'hawk-tattoo';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.whileAttached({
            effect: AbilityDsl.effects.addTrait('tattooed')
        });

        this.reaction('Move attached character to the conflict')
            .when({
                onCardPlayed: (event, context) => context.source.parentCharacter && event.card === context.source && this.game.isDuringConflict()
            })
            .gameAction(AbilityDsl.actions.moveToConflict((context) => ({ target: context.source.parentCharacter ?? [] })), AbilityDsl.actions.playerLastingEffect((context) => ({
                targetController: context.player,
                duration: Duration.UntilPassPriority,
                effect: context.source.parentCharacter?.hasTrait('monk') ? AbilityDsl.effects.additionalAction() : []
            })))
            .effect('move {1} into the conflict{2}', context => [context.source.parentCharacter, context.source.parentCharacter?.hasTrait('monk') ? ' and take an additional action' : '']);
    }
}


export default HawkTattoo;
