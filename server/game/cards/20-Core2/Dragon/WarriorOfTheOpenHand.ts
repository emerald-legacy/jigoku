import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class WarriorOfTheOpenHand extends DrawCard {
    static id = 'warrior-of-the-open-hand';

    setupCardAbilities() {
        this.action({
            title: 'Return to hand',
            condition: (context) =>
                context.source.isAttacking() &&
                context.game.currentConflict.getNumberOfParticipantsFor(context.player.opponent) > 0,
            gameAction: AbilityDsl.actions.returnToHand(),
            max: AbilityDsl.limit.perRound(1)
        });
    }
}
