import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import { deckSearch, moveCard } from '../../GameActions/GameActions.js';
import { claimsRoleElement } from '../claimedRings.js';

class SeekerInitiate extends DrawCard {
    static id = 'seeker-initiate';

    setupCardAbilities() {
        this.reaction('Look at top 5 cards')
            .when({
                onClaimRing: (event, context) => claimsRoleElement(context.player, event) && event.player === context.player && context.player.conflictDeck.length > 0
            })
            .gameAction(deckSearch({
                amount: 5,
                reveal: false,
                gameAction: moveCard({
                    destination: Location.Hand
                })
            }))
            .effect('look at the top 5 cards of their conflict deck');
    }
}


export default SeekerInitiate;
