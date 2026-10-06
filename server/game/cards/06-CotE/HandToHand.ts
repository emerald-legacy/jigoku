import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType, ConflictType } from '../../Constants.js';
import { opponentMayResolveAgain } from '../resolveAgain.js';

class HandToHand extends DrawCard {
    static id = 'hand-to-hand';

    setupCardAbilities() {
        this.conflictAction('Discard an attachment', { conflictType: ConflictType.Military })
            .target({
                cardType: CardType.Attachment,
                cardCondition: (card) => Boolean(card.parentCharacter?.isParticipating())
            }, AbilityDsl.actions.discardFromPlay())
            .effect('discard {0} from play')
            .then((context) => opponentMayResolveAgain(context, 'Resolve Hand to Hand\'s ability again?'));
    }
}


export default HandToHand;
