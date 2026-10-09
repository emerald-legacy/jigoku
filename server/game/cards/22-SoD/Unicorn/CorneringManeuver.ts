import { msg } from '../../../GameChat.js';
import { CardType, Players, ConflictType } from '../../../Constants.js';
import { modifyMilitarySkill } from '../../../effects.js';
import { cardLastingEffect, moveToConflict, multiple, sendHome } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class CorneringManeuver extends DrawCard {
    static id = 'cornering-maneuver';

    setupCardAbilities() {
        this.conflictAction('Give a character +2 mil', { conflictType: ConflictType.Military })
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isParticipatingFor(context.player)
            }, cardLastingEffect({
                effect: modifyMilitarySkill(2)
            }))
            .chatText((context) => msg`give ${context.chatTarget()} +2${'military'}`)
            .then()
            .selectCard({
                activePromptTitle: 'Choose a character to move',
                targets: true,
                optional: true,
                controller: Players.Self,
                cardType: CardType.Character,
                message: (_context, card, player) => msg`${player} moves ${card} ${card.isParticipating() ? 'home' : 'to the conflict'}`,
                gameAction: multiple([
                    sendHome(),
                    moveToConflict()
                ])
            });
    }
}
