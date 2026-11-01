import { discardFromPlay } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { CardType, ConflictType } from '../../Constants.js';

class HandToHand extends DrawCard {
    static id = 'hand-to-hand';

    override setupCardAbilities() {
        this.action('Discard an attachment')
            .condition((context) => context.game.isDuringConflict(ConflictType.Military))
            .target({
                cardType: CardType.Attachment,
                cardCondition: (card) => Boolean(card.parentCharacter?.isParticipating())
            }, discardFromPlay())
            .chatText('discard {0} from play')
            .opponentMayResolveAgain('Resolve Hand to Hand\'s ability again?');
    }
}


export default HandToHand;
