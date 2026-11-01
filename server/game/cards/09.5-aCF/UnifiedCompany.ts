import DrawCard from '../../DrawCard.js';
import { putIntoPlay } from '../../GameActions/GameActions.js';
import { CardType, Players, Location, Trait } from '../../Constants.js';

class UnifiedCompany extends DrawCard {
    static id = 'unified-company';

    override setupCardAbilities() {
        this.reaction('Put a 2 cost or less bushi into play from dynasty discard')
            .when({
                afterConflict: (event, context) => {
                    return event.conflict.isOnWinningSide(context.source) &&
                        context.player.opponent &&
                        context.player.hand.length < context.player.opponent.hand.length;
                }
            })
            .selectCard(() => ({
                cardType: CardType.Character,
                location: Location.DynastyDiscardPile,
                controller: Players.Self,
                cardCondition: (card) => {
                    return card.hasTrait(Trait.Bushi) &&
                        card.costLessThan(3) &&
                        !card.isUnique();
                },
                gameAction: putIntoPlay()
            }));
    }
}


export default UnifiedCompany;
