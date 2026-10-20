import * as costs from '../../../costs/index.js';
import { handler } from '../../../GameActions/GameActions.js';
import { Location, CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

const ACTIVE_LOCATIONS = [Location.Hand, Location.PlayArea];

export default class LuckyCoin extends DrawCard {
    static id = 'lucky-coin';

    override setupCardAbilities() {
        this.reaction('Replace all cards in your provinces')
            .when({
                onRevealFacedownDynastyCards: (_, context) => {
                    const totalCost = context.player
                        .getDynastyCardsInProvince(Location.Provinces)
                        .reduce((totalCost, card) => {
                            const isCharacter = card.type === CardType.Character;
                            const cost = isCharacter && !card.facedown && card.printedCost !== null && !isNaN(card.printedCost) ? card.printedCost : 0;
                            return totalCost + cost;
                        }, 0);
                    return totalCost < 6 || totalCost > 12;
                }
            })
            .location(ACTIVE_LOCATIONS)
            .cost(costs.removeSelfFromGame({ location: ACTIVE_LOCATIONS }))
            .gameAction(handler({
                handler: ({ player, game }) => {
                    // set aside out of the deck, so the refill can't draw them back
                    const setAside = player.getDynastyCardsInProvince(Location.Provinces);
                    for(const card of setAside) {
                        player.moveCard(card, Location.RemovedFromGame);
                    }

                    for(const location of game.getProvinceArray(false)) {
                        player.putTopDynastyCardInProvince(location, false);
                    }

                    game.queueSimpleStep(() => {
                        for(const card of setAside) {
                            player.moveCard(card, Location.DynastyDeck);
                        }
                        player.shuffleDynastyDeck();
                    });
                }
            }))
            .chatText('replace all cards in their provinces');
    }
}
