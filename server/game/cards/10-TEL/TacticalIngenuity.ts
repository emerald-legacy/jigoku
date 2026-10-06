import DrawCard from '../../DrawCard.js';
import { gainAbility } from '../../effects.js';
import { deckSearch, moveCard } from '../../GameActions/GameActions.js';
import { AbilityType, CardType, Location } from '../../Constants.js';

class TacticalIngenuity extends DrawCard {
    static id = 'tactical-ingenuity';

    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'commander'
        });
        this.whileAttached({
            effect: gainAbility(AbilityType.Action, {
                title: 'Reveal and draw an event',
                condition: (context) => context.source.isParticipating(),
                effect: 'look at the top four cards of their deck',
                gameAction: deckSearch({
                    amount: 4,
                    cardCondition: (card) => card.type === CardType.Event,
                    gameAction: moveCard({
                        destination: Location.Hand
                    })
                })
            })
        });
    }
}


export default TacticalIngenuity;
