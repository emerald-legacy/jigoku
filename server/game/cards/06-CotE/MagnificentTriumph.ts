import { msg } from '../../GameChat.js';
import { CardType, Players } from '../../Constants.js';
import { cardCannot, modifyBothSkills } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { DuelsThisConflict } from '../DuelsThisConflict.js';

export default class MagnificentTriumph extends DrawCard {
    static id = 'magnificent-triumph';

    public setupCardAbilities() {
        const duelWinners = DuelsThisConflict.winners(this.game);
        this.conflictAction('Give a character +2/+2')
            .target({
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => duelWinners.has(card)
            }, cardLastingEffect((context) => ({
                effect: [
                    modifyBothSkills(2),
                    cardCannot({
                        cannot: 'target',
                        restricts: 'opponentsEvents',
                        applyingPlayer: context.player
                    })
                ]
            })))
            .chatText((context) => msg`give ${context.chatTarget()} +2${'military'}, +2${'political'}, and prevent them from being targeted by opponent's events`);
    }
}
