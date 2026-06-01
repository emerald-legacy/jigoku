import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityTypes } from '../../Constants.js';

class BeliefInTheLittleTeacher extends DrawCard {
    static id = 'belief-in-the-little-teacher';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Discard character\'s status token',
                gameAction: AbilityDsl.actions.selectToken((context: AbilityContext) => ({
                    card: context.source,
                    activePromptTitle: 'Which token do you wish to discard?',
                    message: '{0} discards {1}',
                    messageArgs: (token: any, player: any) => [player, token],
                    gameAction: AbilityDsl.actions.discardStatusToken()
                })),
                effect: 'discard a status token from {1}',
                effectArgs: (context: AbilityContext) => [context.source]
            })
        });
    }
}


export default BeliefInTheLittleTeacher;
