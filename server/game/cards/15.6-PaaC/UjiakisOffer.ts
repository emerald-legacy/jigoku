import DrawCard from '../../DrawCard.js';
import { CardType, ConflictType } from '../../Constants.js';
import { placeFate } from '../../GameActions/GameActions.js';

class UjiakisOffer extends DrawCard {
    static id = 'ujiaki-s-offer';

    override setupCardAbilities() {
        this.action('Place a fate on a participating character, bow it, move it home, and dishonor it')
            .condition((context) => context.game.isDuringConflict(ConflictType.Political))
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isParticipating() && context.player.cardsInPlay.some((myCard) => (
                    myCard !== card && myCard.isParticipating() && card.costAtMost(myCard.getCost())))
            }, placeFate())
            .chatText('place a fate on {0} then bow, dishonor, and move them home')
            .then()
            .bow((context) => ({ target: context.target }))
            .dishonor((context) => ({ target: context.target }))
            .sendHome((context) => ({ target: context.target }));
    }
}

export default UjiakisOffer;
