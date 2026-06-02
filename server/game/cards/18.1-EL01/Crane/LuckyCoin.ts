import AbilityDsl from '../../../abilitydsl.js';
import { Location } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { parseGameMode } from '../../../GameMode.js';

const ACTIVE_LOCATIONS = [Location.Hand, Location.PlayArea];

export default class LuckyCoin extends DrawCard {
    static id = 'lucky-coin';

    setupCardAbilities() {
        this.reaction({
            title: 'Replace all cards in your provinces',
            when: {
                onRevealFacedownDynastyCards: (_, context) => {
                    const totalCost = context.player
                        .getDynastyCardsInProvince(Location.Provinces)
                        .reduce((totalCost: number, card: DrawCard) => {
                            const cost = !card.facedown && card.printedCost !== null && !isNaN(card.printedCost) ? card.printedCost : 0;
                            return totalCost + (cost ?? 0);
                        }, 0);
                    return totalCost < 6 || totalCost > 12;
                }
            },
            cost: AbilityDsl.costs.removeSelfFromGame({ location: ACTIVE_LOCATIONS }),
            location: ACTIVE_LOCATIONS,
            gameAction: AbilityDsl.actions.handler({
                handler: ({ player, game }) => {
                    const cardsToMulligan = player.getDynastyCardsInProvince(Location.Provinces);

                    for(const card of cardsToMulligan) {
                        player.moveCard(card, 'dynasty deck bottom');
                    }

                    for(const location of parseGameMode(game.gameMode).setupNonStrongholdProvinces) {
                        player.putTopDynastyCardInProvince(location, false);
                    }

                    player.shuffleDynastyDeck();
                }
            }),
            effect: 'to replace all cards in their provinces'
        });
    }
}
