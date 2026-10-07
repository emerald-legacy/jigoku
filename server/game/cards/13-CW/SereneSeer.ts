import DrawCard from '../../DrawCard.js';
import { lookAt } from '../../GameActions/GameActions.js';
import { Location, Players, CardType, Element } from '../../Constants.js';
import { claimedRingSymbols, hasClaimedRing } from '../claimedRings.js';

const elementSymbol = { key: 'serene-seer-void', element: Element.Void };

class SereneSeer extends DrawCard {
    static id = 'serene-seer';

    setupCardAbilities() {
        this.action('Look at a province')
            .condition(context => context.player.opponent !== undefined && hasClaimedRing(this, elementSymbol.key, context.player.opponent))
            .selectCard({
                activePromptTitle: 'Choose a province to look at',
                cardType: CardType.Province,
                location: Location.Provinces,
                controller: Players.Opponent,
                gameAction: lookAt(context => ({
                    message: '{0} sees {1} in {2}',
                    messageArgs: (cards) => [context.source, cards[0], cards[0].location]
                }))
            })
            .effect('look at a province');
    }

    getPrintedElementSymbols() {
        return [...super.getPrintedElementSymbols(), ...claimedRingSymbols([elementSymbol])];
    }
}


export default SereneSeer;

