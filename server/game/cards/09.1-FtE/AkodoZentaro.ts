import DrawCard from '../../DrawCard.js';
import { discardCard, ifAble, moveCard, multiple, selectCard } from '../../GameActions/GameActions.js';
import { CardType, Location, Players } from '../../Constants.js';

class AkodoZentaro extends DrawCard {
    static id = 'akodo-zentaro';

    setupCardAbilities() {
        this.action('Take control of holding')
            .condition(context => context.source.isAttacking())
            .target({
                cardType: CardType.Holding,
                controller: Players.Opponent,
                location: Location.Provinces,
                cardCondition: card => card.isInConflictProvince() && !card.isUnique() && card.isFaceup()
            }, ifAble(context => ({
                ifAbleAction: selectCard({
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
                }),
                otherwiseAction: discardCard({ target: context.target })
            })))
            .effect('take control of {0} and move it one of their provinces');
    }
}


export default AkodoZentaro;
