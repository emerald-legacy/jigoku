import DrawCard from '../../DrawCard.js';
import { CardType, Duration, Location } from '../../Constants.js';
import { cannotBeAttacked } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class AgashaTaiko extends DrawCard {
    static id = 'agasha-taiko';

    setupCardAbilities() {
        this.reaction('Choose a province')
            .when({
                onCardPlayed: (event, context) => event.card === context.source
            })
            .target({
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: card => card.location !== Location.StrongholdProvince
            }, cardLastingEffect({
                targetLocation: Location.Provinces,
                duration: Duration.UntilEndOfRound,
                effect: cannotBeAttacked()
            }))
            .effect('prevent {1}\'s {2} in {3} from being attacked this round', context => [
                context.target.controller,
                context.target.isFacedown() ? 'hidden province' : context.target,
                context.target.location
            ]);
    }
}


export default AgashaTaiko;
