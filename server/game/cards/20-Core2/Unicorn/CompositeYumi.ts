import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext';

export default class CompositeYumi extends DrawCard {
    static id = 'composite-yumi';

    setupCardAbilities() {
        this.reaction({
            title: 'Give attached character +1/+0',
            when: {
                onMoveToConflict: (_, context) => this.#matchCondition(context),
                onCharacterEntersPlay: (_, context) => this.#matchCondition(context),
                onCreateTokenCharacter: (_, context) => this.#matchCondition(context)
            },
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.source.parent,
                effect: AbilityDsl.effects.modifyMilitarySkill(1)
            })),
            effect: 'give +1{1} to {2}',
            effectArgs: (context) => ['military', context.source.parent],
            limit: AbilityDsl.limit.unlimitedPerConflict()
        });
    }

    #matchCondition(context: TriggeredAbilityContext) {
        return context.source.parent && context.game.isDuringConflict('military');
    }
}
