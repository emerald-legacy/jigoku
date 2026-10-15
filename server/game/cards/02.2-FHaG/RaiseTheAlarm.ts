import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { CardType, Location, Players, ConflictType } from '../../Constants.js';
import { flipDynasty, putIntoConflict } from '../../GameActions/GameActions.js';

class RaiseTheAlarm extends DrawCard {
    static id = 'raise-the-alarm';

    override setupCardAbilities() {
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
            .if((context) => context.target.type === CardType.Character && context.target.isDrawCard() && putIntoConflict().canAffect(context.target, context))
            .chatMessage((context) => msg`${context.target} is revealed and brought into the conflict`)
            .putIntoConflict((context) => ({ target: context.target }))
            .otherwise()
            .chatMessage((context) => msg`${context.target} is revealed but cannot be brought into the conflict`);
    }
}


export default RaiseTheAlarm;
