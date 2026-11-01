import DrawCard from '../../DrawCard.js';
import { Phase, Element, RestrictionType } from '../../Constants.js';
import { cardCannot } from '../../effects.js';
import { claimedRingSymbols, hasClaimedRing } from '../claimedRings.js';

const elementSymbol = { key: 'ascetic-of-the-north-wall-earth', element: Element.Earth };

class AsceticOfTheNorthWall extends DrawCard {
    static id = 'ascetic-of-the-north-wall';

    override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => hasClaimedRing(this, elementSymbol.key, context.player) && context.game.currentPhase !== Phase.Fate,
            effect: [
                cardCannot(RestrictionType.RemoveFate),
                cardCannot(RestrictionType.DiscardFromPlay)
            ]
        });
    }

    protected override printedElementSymbols = claimedRingSymbols([elementSymbol]);
}


export default AsceticOfTheNorthWall;
