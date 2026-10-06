import DrawCard from '../../DrawCard.js';
import { CardType, ConflictType } from '../../Constants.js';
import { bow, dishonor, multiple, placeFate, sendHome } from '../../GameActions/GameActions.js';

class UjiakisOffer extends DrawCard {
    static id = 'ujiaki-s-offer';

    setupCardAbilities() {
        this.conflictAction('Place a fate on a participating character, bow it, move it home, and dishonor it', { conflictType: ConflictType.Political })
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isParticipating() && context.player.cardsInPlay.some((myCard) => (
                    myCard !== card && myCard.isParticipating() && (myCard.printedCost ?? 0) >= (card.printedCost ?? 0)))
            }, placeFate())
            .effect('place a fate on {0} then bow, dishonor, and move them home')
            .then()
            .gameAction(multiple([
                bow((context) => ({ target: context.target })),
                dishonor((context) => ({ target: context.target })),
                sendHome((context) => ({ target: context.target }))
            ]));
    }
}

export default UjiakisOffer;
