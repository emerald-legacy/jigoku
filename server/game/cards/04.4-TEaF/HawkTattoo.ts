import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Duration } from '../../Constants.js';

class HawkTattoo extends DrawCard {
    static id = 'hawk-tattoo';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.attachmentConditions({
            myControl: true
        });

        this.whileAttached({
            effect: ability.effects.addTrait('tattooed')
        });

        this.reaction('Move attached character to the conflict')
            .when({
                onCardPlayed: (event, context) => context.source.parentCharacter && event.card === context.source && this.game.isDuringConflict()
            })
            .gameAction(ability.actions.moveToConflict((context) => ({ target: context.source.parentCharacter ?? [] })), ability.actions.playerLastingEffect((context) => ({
                targetController: context.player,
                duration: Duration.UntilPassPriority,
                effect: context.source.parentCharacter?.hasTrait('monk') ? ability.effects.additionalAction() : []
            })))
            .effect('move {1} into the conflict{2}', context => [context.source.parentCharacter, context.source.parentCharacter?.hasTrait('monk') ? ' and take an additional action' : '']);
    }
}


export default HawkTattoo;
