import DrawCard from '../../DrawCard.js';
import { CardType, Location } from '../../Constants.js';
import { lookAt } from '../../GameActions/GameActions.js';
import { lookAtProvincesMessage } from '../lookAtProvincesMessage.js';

class HuntingFalcon extends DrawCard {
    static id = 'hunting-falcon';

    override setupCardAbilities() {
        this.reaction('Look at a province')
            .when({
                onCardAttached: (event, context) => event.card === context.source && event.originalLocation !== Location.PlayArea
            })
            .target({
                location: Location.Provinces,
                cardType: CardType.Province,
                cardCondition: (card) => card.isFacedown()
            }, lookAt({
                message: lookAtProvincesMessage
            }));
    }
}


export default HuntingFalcon;
