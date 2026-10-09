import DrawCard from '../../DrawCard.js';
import { gainAbility } from '../../effects.js';
import { moveCard } from '../../GameActions/GameActions.js';
import { CardType, Location } from '../../Constants.js';

class TacticalIngenuity extends DrawCard {
    static id = 'tactical-ingenuity';

    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'commander'
        });
        this.whileAttached({
            effect: gainAbility.action('Reveal and draw an event', (ability) => ability
                .condition((context) => context.source.isParticipating())
                .deckSearch({
                    cardsToLookAt: 4,
                    cardCondition: (card) => card.type === CardType.Event,
                    gameAction: moveCard({
                        destination: Location.Hand
                    })
                })
                .chatText('look at the top four cards of their deck'))
        });
    }
}


export default TacticalIngenuity;
