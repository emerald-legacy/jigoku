import { msg } from '../../../GameChat.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType, Players } from '../../../Constants.js';
import { perConflict } from '../../../AbilityLimit.js';
import { modifyBothSkills } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class TillTheLastOneFalls extends DrawCard {
    static id = 'till-the-last-one-falls-';

    public setupCardAbilities() {
        this.action('Give a character a skill bonus')
            .condition((context) =>
                !!context.game.currentConflict?.hasMoreParticipants(context.player.opponent))
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating()
            }, cardLastingEffect((context) => ({
                effect: modifyBothSkills(this.bonus(context))
            })))
            .chatText((context) => msg`give ${context.chatTarget()} +${this.bonus(context)}${'military'}/+${this.bonus(context)}${'political'}`)
            .max(perConflict(1));
    }

    private bonus(context: AbilityContext): number {
        const conflict = context.game.requireConflict();
        const opponentCount = conflict.getNumberOfParticipantsFor(context.player.opponent);
        return 2 * opponentCount;
    }
}
