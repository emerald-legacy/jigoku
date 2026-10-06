import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType, Players } from '../../../Constants.js';
import { modifyBothSkills } from '../../../effects.js';
import { cardLastingEffect, gainHonor } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

function penalty(context: AbilityContext): number {
    const conflict = context.game.currentConflict;
    if(!conflict) {
        return 0;
    }
    const scholars = conflict.getNumberOfParticipantsFor(context.player, card => card.hasTrait('scholar'));
    return -2 * scholars;
}

export default class AsakoShun extends DrawCard {
    static id = 'asako-shun';

    setupCardAbilities() {
        this.action('Give a skill penalty to a participating character')
            .condition((context) => context.source.isParticipating())
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, cardLastingEffect((context) => ({
                effect: modifyBothSkills(penalty(context))
            })))
            .effect((context) => msg`give ${context.target} ${penalty(context)}${'military'} and ${penalty(context)}${'political'}`)
            .then((context) => ({
                thenCondition: () => {
                    const conflict = context.game.currentConflict;
                    return !!conflict && conflict.calculateSkillFor([context.target]) === 0;
                },
                gameAction: gainHonor(),
                message: '{4} gains 1 honor because {3} is not contributing skill to the current conflict',
                messageArgs: () => [context.target, context.player]
            }));
    }
}
