import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';

export default class CompositeYumi extends DrawCard {
    static id = 'composite-yumi';

    setupCardAbilities() {
        this.reaction('Give attached character +1/+0')
            .when({
                onMoveToConflict: (_, context) => this.#matchCondition(context),
                onCharacterEntersPlay: (_, context) => this.#matchCondition(context),
                onCreateTokenCharacter: (_, context) => this.#matchCondition(context)
            })
            .gameAction(AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.source.parentCharacter ?? [],
                effect: AbilityDsl.effects.modifyMilitarySkill(1)
            })))
            .effect('give +1{1} to {2}', (context) => ['military', context.source.parentCharacter])
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }

    #matchCondition(context: TriggeredAbilityContext<this>) {
        return context.source.parentCharacter && context.source.parentCharacter.isParticipating() && context.game.isDuringConflict('military');
    }
}
