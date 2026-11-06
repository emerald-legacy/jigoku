import DrawCard from '../../DrawCard.js';
import { Location, Players, CardType, DeckType } from '../../Constants.js';
import { perConflictOpportunity } from '../../AbilityLimit.js';
import { moveCard } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';
import { topCards } from '../topCards.js';

class OurFoeDoesNotWait extends DrawCard {
    static id = 'our-foe-does-not-wait';

    override setupCardAbilities() {
        this.reaction('Place a card from your deck faceup on a province')
            .when({
                onConflictPass: (event, context) => event.conflict.attackingPlayer === context.player

            })
            .target({
                cardType: CardType.Province,
                controller: Players.Self,
                location: Location.Provinces,
                cardCondition: (card) => card.location !== Location.StrongholdProvince && !card.isBroken
            })
            .deckSearch((context) => ({
                cardsToLookAt: 8,
                deck: DeckType.Dynasty,
                gameAction: moveCard({
                    faceup: true,
                    destination: context.target.location
                })
            }))
            .chatText((context) => msg`look at the ${topCards(8, context.player.dynastyDeck.length, true)} of their dynasty deck`)
            .max(perConflictOpportunity(1));
    }
}


export default OurFoeDoesNotWait;
