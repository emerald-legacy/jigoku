import DrawCard from '../../DrawCard.js';
import { lookAt } from '../../GameActions/GameActions.js';
import { Location, Players, CardType, Element } from '../../Constants.js';
import { claimedRingSymbols, hasClaimedRing } from '../claimedRings.js';
import { lookAtProvincesMessage } from '../lookAtProvincesMessage.js';

const elementSymbol = { key: 'serene-seer-void', element: Element.Void };

class SereneSeer extends DrawCard {
    static id = 'serene-seer';

    override setupCardAbilities() {
        this.action('Look at a province')
            .condition((context) => context.player.opponent !== undefined && hasClaimedRing(this, elementSymbol.key, context.player.opponent))
            .target({
                activePromptTitle: 'Choose a province to look at',
                cardType: CardType.Province,
                location: Location.Provinces,
                controller: Players.Opponent
            }, lookAt({
                message: lookAtProvincesMessage
            }))
            .chatText('look at a province');
    }

    protected override printedElementSymbols = claimedRingSymbols([elementSymbol]);
}


export default SereneSeer;

