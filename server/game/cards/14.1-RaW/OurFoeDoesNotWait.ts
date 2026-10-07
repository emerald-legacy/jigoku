import DrawCard from '../../DrawCard.js';
import { Location, Players, CardType, Decks } from '../../Constants.js';
import { perConflictOpportunity } from '../../AbilityLimit.js';
import { moveCard } from '../../GameActions/GameActions.js';

class OurFoeDoesNotWait extends DrawCard {
    static id = 'our-foe-does-not-wait';

    setupCardAbilities() {
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
                amount: 8,
                deck: Decks.DynastyDeck,
                gameAction: moveCard({
                    faceup: true,
                    destination: context.target.location
                })
            }))
            .effect('look at the top eight cards of their dynasty deck')
            .max(perConflictOpportunity(1));
    }
}


export default OurFoeDoesNotWait;
