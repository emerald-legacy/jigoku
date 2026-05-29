import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Durations } from '../../Constants.js';

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
            effectArgs: context => [context.source.parent, context.source.parent.hasTrait('monk') ? ' and take an additional action' : ''],
            when: {
                onCardPlayed: (event, context) => context.source.parent && event.card === context.source && this.game.isDuringConflict()
            },
            gameAction: [
                ability.actions.moveToConflict((context: any) => ({ target: context.source.parent })),
                ability.actions.playerLastingEffect((context: any) => ({
                    targetController: context.player,
                    duration: Durations.UntilPassPriority,
                    effect: context.source.parent.hasTrait('monk') ? ability.effects.additionalAction() : []
                }))
            ]
        });
    }
}


export default HawkTattoo;
