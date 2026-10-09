import DrawCard from '../../DrawCard.js';
import { unlimitedPerConflict } from '../../AbilityLimit.js';
import { moveCard } from '../../GameActions/GameActions.js';
import { Location, CardType } from '../../Constants.js';

class KyofukisHammer extends DrawCard {
    static id = 'kyofuki-s-hammer';

    setupCardAbilities() {
        this.reaction('Discard a card from a province')
            .when({
                afterConflict: (event, context) => context.source.parentCharacter && context.source.parentCharacter.isParticipating() &&
                                                    event.conflict.winner === context.source.parentCharacter.controller
            })
            .target({
                location: Location.Provinces,
                cardType: [CardType.Character, CardType.Holding, CardType.Event]
            }, moveCard({ destination: Location.DynastyDiscardPile }))
            .limit(unlimitedPerConflict());
    }
}


export default KyofukisHammer;

