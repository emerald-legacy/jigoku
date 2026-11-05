import DrawCard from '../../DrawCard.js';
import { gainAbility } from '../../effects.js';
import { moveCard } from '../../GameActions/GameActions.js';
import { CardType, Location, Trait } from '../../Constants.js';
import { msg } from '../../GameChat.js';
import { topCards } from '../topCards.js';

class TacticalIngenuity extends DrawCard {
    static id = 'tactical-ingenuity';

    override setupCardAbilities() {
        this.attachmentConditions({
            trait: Trait.Commander
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
                .chatText((context) => msg`look at the ${topCards(4, context.player.conflictDeck.length, true)} of their deck`))
        });
    }
}


export default TacticalIngenuity;
