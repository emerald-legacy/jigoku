import DrawCard from '../../DrawCard.js';
import { putIntoPlay } from '../../GameActions/GameActions.js';
import { CardType, Location } from '../../Constants.js';

class AshigaruLevy extends DrawCard {
    static id = 'ashigaru-levy';

    setupCardAbilities() {
        this.reaction('Release the levies')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source
            })
            .target({
                cardType: CardType.Character,
                location: [Location.Provinces, Location.DynastyDiscardPile],
                cardCondition: (card, context) => card.owner === context.player && card.id === 'ashigaru-levy'
            }, putIntoPlay())
            .effect('put {0} into play');
    }
}


export default AshigaruLevy;
