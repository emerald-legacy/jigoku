import DrawCard from '../../DrawCard.js';
import { putIntoPlay } from '../../GameActions/GameActions.js';
import { CardType, Players, Location } from '../../Constants.js';

class UnifiedCompany extends DrawCard {
    static id = 'unified-company';

    setupCardAbilities() {
        this.reaction('Put a 2 cost or less bushi into play from dynasty discard')
            .when({
                afterConflict: (event, context) => {
                    return event.conflict.winner === context.source.controller &&
                        context.source.isParticipating() &&
                        context.player.opponent &&
                        context.player.hand.length < context.player.opponent.hand.length;
                }
            })
            .selectCard(() => ({
                cardType: CardType.Character,
                location: Location.DynastyDiscardPile,
                controller: Players.Self,
                cardCondition: (card) => {
                    return card.hasTrait('bushi') &&
                        card.costLessThan(3) &&
                        !card.isUnique();
                },
                gameAction: putIntoPlay()
            }));
    }
}


export default UnifiedCompany;
