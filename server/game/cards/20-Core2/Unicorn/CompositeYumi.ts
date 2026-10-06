import AbilityDsl from '../../../abilitydsl.js';
import { modifyMilitarySkill } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import { ConflictType } from '../../../Constants.js';
import { msg } from '../../../GameChat.js';

export default class CompositeYumi extends DrawCard {
    static id = 'composite-yumi';

    setupCardAbilities() {
        this.reaction('Give attached character +1/+0')
            .when({
                onMoveToConflict: (_, context) => this.matchCondition(context),
                onCharacterEntersPlay: (_, context) => this.matchCondition(context),
                onCreateTokenCharacter: (_, context) => this.matchCondition(context)
            })
            .gameAction(cardLastingEffect((context) => ({
                target: context.source.parentCharacter ?? [],
                effect: modifyMilitarySkill(1)
            })))
            .effect((context) => msg`give +1${'military'} to ${context.source.parentCharacter}`)
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }

    private matchCondition(context: TriggeredAbilityContext<this>) {
        return context.source.parentCharacter && context.source.parentCharacter.isParticipating() && context.game.isDuringConflict(ConflictType.Military);
    }
}
