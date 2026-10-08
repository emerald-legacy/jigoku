import * as costs from '../../../costs/index.js';
import { handler } from '../../../GameActions/GameActions.js';
import { Location } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

const ACTIVE_LOCATIONS = [Location.Hand, Location.PlayArea];

export default class LuckyCoin extends DrawCard {
    static id = 'lucky-coin';

    setupCardAbilities() {
        this.reaction('Replace all cards in your provinces')
            .when({
                onRevealFacedownDynastyCards: (_, context) => {
                    const totalCost = context.player
                        .getDynastyCardsInProvince(Location.Provinces)
                        .reduce((totalCost, card) => {
                            const cost = !card.facedown && card.printedCost !== null && !isNaN(card.printedCost) ? card.printedCost : 0;
                            return totalCost + cost;
                        }, 0);
                    return totalCost < 6 || totalCost > 12;
                }
            })
            .cost(costs.removeSelfFromGame({ location: ACTIVE_LOCATIONS }))
            .gameAction(handler({
                handler: ({ player, game }) => {
                    const cardsToMulligan = player.getDynastyCardsInProvince(Location.Provinces);

                    for(const card of cardsToMulligan) {
                        player.moveCard(card, Location.DynastyDeck, { bottom: true });
                    }

                    for(const location of game.rules.setupNonStrongholdProvinces) {
                        player.putTopDynastyCardInProvince(location, false);
                    }

                    player.shuffleDynastyDeck();
                }
            }))
            .chatText('to replace all cards in their provinces')
            .location(ACTIVE_LOCATIONS);
    }
}
