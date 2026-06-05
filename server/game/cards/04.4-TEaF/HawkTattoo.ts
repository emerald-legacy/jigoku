import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
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

        this.reaction({
            title: 'Move attached character to the conflict',
            effect: 'move {1} into the conflict{2}',
            effectArgs: context => [context.source.parent as DrawCard, (context.source.parent as DrawCard).hasTrait('monk') ? ' and take an additional action' : ''],
            when: {
                onCardPlayed: (event, context) => context.source.parent && event.card === context.source && this.game.isDuringConflict()
            },
            gameAction: [
                ability.actions.moveToConflict((context: AbilityContext<this>) => ({ target: context.source.parent as DrawCard })),
                ability.actions.playerLastingEffect((context: AbilityContext<this>) => ({
                    targetController: context.player,
                    duration: Duration.UntilPassPriority,
                    effect: (context.source.parent as DrawCard).hasTrait('monk') ? ability.effects.additionalAction() : []
                }))
            ]
        });
    }
}


export default HawkTattoo;
