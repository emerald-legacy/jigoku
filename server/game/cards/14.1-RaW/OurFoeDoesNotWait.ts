import BaseCard from '../../BaseCard.js';
import DrawCard from '../../DrawCard.js';
import type { ProvinceCard } from '../../ProvinceCard.js';
import { Location, Players, CardType, Decks } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class OurFoeDoesNotWait extends DrawCard {
    static id = 'our-foe-does-not-wait';

    setupCardAbilities() {
        this.reaction({
            title: 'Place a card from your deck faceup on a province',
            when: {
                onConflictPass: (event, context) => event.conflict.attackingPlayer === context.player

            },
            max: AbilityDsl.limit.perConflictOpportunity(1),
            effect: 'look at the top eight cards of their dynasty deck',
            target: {
                cardType: CardType.Province,
                controller: Players.Self,
                location: Location.Provinces,
                cardCondition: (card: BaseCard) => card.location !== Location.StrongholdProvince && !(card as ProvinceCard).isBroken
            },
            gameAction: AbilityDsl.actions.deckSearch(context => ({
                amount: 8,
                deck: Decks.DynastyDeck,
                gameAction: AbilityDsl.actions.moveCard({
                    faceup: true,
                    destination: context.target.location
                })
            }))
        });
    }
}


export default OurFoeDoesNotWait;
