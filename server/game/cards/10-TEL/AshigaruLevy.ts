import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Location } from '../../Constants.js';

class AshigaruLevy extends DrawCard {
    static id = 'ashigaru-levy';

    setupCardAbilities() {
        this.reaction({
            title: 'Release the levies!',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardType.Character,
                location: [Location.Provinces, Location.DynastyDiscardPile],
                cardCondition: (card, context) => card.owner === context.player && card.id === 'ashigaru-levy',
                gameAction: AbilityDsl.actions.putIntoPlay()
            },
            effect: 'put {0} into play.'
        });
    }
}


export default AshigaruLevy;
