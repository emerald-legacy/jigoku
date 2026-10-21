import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { discardCard, moveCard, multiple, selectCard } from '../../GameActions/GameActions.js';
import { CardType, Location, Players } from '../../Constants.js';

const moveToProvince = selectCard((context) => ({
    cardType: CardType.Province,
    location: Location.Provinces,
    controller: Players.Self,
    cardCondition: (card) => card.location !== Location.StrongholdProvince && card.isProvinceCard() && !card.isBroken,
    subActionProperties: (card) => ({ destination: card.location, target: context.player.getDynastyCardsInProvince(card.location) }),
    gameAction: multiple([
        moveCard({
            target: context.target,
            changePlayer: true
        }),
        discardCard()
    ])
}));

class AkodoZentaro extends DrawCard {
    static id = 'akodo-zentaro';

    override setupCardAbilities() {
        this.action('Take control of holding')
            .condition((context) => context.source.isAttacking())
            .target({
                cardType: CardType.Holding,
                controller: Players.Opponent,
                location: Location.Provinces,
                cardCondition: (card) => card.isInConflictProvince() && !card.isUnique() && card.isFaceup()
            })
            .ifAble()
            .gameAction(moveToProvince)
            .otherwise()
            .discardCard((context) => ({ target: context.target }))
            .chatText((context) => moveToProvince.hasLegalTarget(context)
                ? msg`take control of ${context.target} and move it to one of their provinces`
                : msg`discard ${context.target}`);
    }
}


export default AkodoZentaro;
