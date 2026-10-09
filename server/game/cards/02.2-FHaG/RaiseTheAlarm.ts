import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { CardType, Location, Players, ConflictType } from '../../Constants.js';
import { flipDynasty, putIntoConflict } from '../../GameActions/GameActions.js';

class RaiseTheAlarm extends DrawCard {
    static id = 'raise-the-alarm';

    setupCardAbilities() {
        this.conflictAction('Flip a dynasty card', { conflictType: ConflictType.Military })
            .condition((context) => context.player.isDefendingPlayer())
            .target({
                controller: Players.Self,
                location: Location.Provinces,
                cardCondition: (card) => card.isInConflictProvince() && card.isFacedown()
            }, flipDynasty())
            .chatText('flip the card in the conflict province faceup')
            .cannotBeMirrored()
            .then()
            .handler((context) => {
                const card = context.target;
                if(card.type === CardType.Character && card.allowGameAction('putIntoConflict', context)) {
                    this.game.addMessage(msg`${card} is revealed and brought into the conflict`);
                    putIntoConflict().resolve(card, context);
                } else {
                    this.game.addMessage(msg`${card} is revealed but cannot be brought into the conflict`);
                }
            });
    }
}


export default RaiseTheAlarm;
