import DrawCard from '../../DrawCard.js';
import { cancel, dishonor, honor } from '../../GameActions/GameActions.js';
import { CardType, EventName } from '../../Constants.js';

class YoungRumormonger extends DrawCard {
    static id = 'young-rumormonger';

    setupCardAbilities() {
        this.wouldInterrupt('Honor/dishonor a different character')
            .when({
                onCardHonored: (event) => event.card.type === CardType.Character,
                onCardDishonored: (event) => event.card.type === CardType.Character
            })
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card !== context.event.card && card.controller === context.event.card.controller
            }, cancel((context) => ({
                replacementGameAction:
                        context.event.name === EventName.OnCardHonored
                            ? honor()
                            : dishonor()
            })));
    }
}


export default YoungRumormonger;
