import DrawCard from '../../DrawCard.js';
import { unlimited } from '../../AbilityLimit.js';
import { moveCard } from '../../GameActions/GameActions.js';
import { Location, CardType } from '../../Constants.js';

class KyofukisHammer extends DrawCard {
    static id = 'kyofuki-s-hammer';

    override setupCardAbilities() {
        this.reaction('Discard a card from a province')
            .when({
                afterConflict: (event, context) => !!context.source.parentCharacter && event.conflict.isOnWinningSide(context.source.parentCharacter)
            })
            .target({
                location: Location.Provinces,
                cardType: [CardType.Character, CardType.Holding, CardType.Event]
            }, moveCard({ destination: Location.DynastyDiscardPile }))
            .limit(unlimited());
    }
}


export default KyofukisHammer;

