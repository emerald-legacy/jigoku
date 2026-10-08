import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType, Players } from '../../../Constants.js';
import { modifyBothSkills } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

function penalty(context: AbilityContext): number {
    const conflict = context.game.currentConflict;
    if(!conflict) {
        return 0;
    }
    const scholars = conflict.getNumberOfParticipantsFor(context.player, (card) => card.hasTrait('scholar'));
    return -2 * scholars;
}

export default class AsakoShun extends DrawCard {
    static id = 'asako-shun';

    setupCardAbilities() {
        this.conflictAction('Give a skill penalty to a participating character')
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, cardLastingEffect((context) => ({
                effect: modifyBothSkills(penalty(context))
            })))
            .chatText((context) => msg`give ${context.target} ${penalty(context)}${'military'} and ${penalty(context)}${'political'}`)
            .thenIf((context) => {
                const conflict = context.game.currentConflict;
                return !!conflict && conflict.calculateSkillFor([context.target]) === 0;
            })
            .gainHonor(1)
            .message((context) => msg`${context.player} gains 1 honor because ${context.target} is not contributing skill to the current conflict`);
    }
}
