import { perRound } from '../../../AbilityLimit.js';
import DrawCard from '../../../DrawCard.js';

export default class WarriorOfTheOpenHand extends DrawCard {
    static id = 'warrior-of-the-open-hand';

    setupCardAbilities() {
        this.conflictAction('Return to hand')
            .condition((context) =>
                !!(context.source.isAttacking() &&
                context.player.opponent &&
                context.game.currentConflict &&
                context.game.currentConflict.getNumberOfParticipantsFor(context.player.opponent) > 0))
            .returnToHand()
            .max(perRound(1));
    }
}
