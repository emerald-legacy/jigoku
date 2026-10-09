import DrawCard from '../../DrawCard.js';
import { CardType, Element } from '../../Constants.js';
import { unlimitedPerConflict } from '../../AbilityLimit.js';
import { removeFromGame } from '../../GameActions/GameActions.js';
import { claimedRingSymbols, claimsRingOf } from '../claimedRings.js';

const elementSymbol = { key: 'isawa-ujina-void', element: Element.Void };

class IsawaUjina extends DrawCard {
    static id = 'isawa-ujina';

    setupCardAbilities() {
        this.forcedReaction('Remove a character from the game')
            .when({
                onClaimRing: (event) => claimsRingOf(this, elementSymbol.key, event)
            })
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.getFate() === 0
            }, removeFromGame())
            .limit(unlimitedPerConflict());
    }

    getPrintedElementSymbols() {
        return [...super.getPrintedElementSymbols(), ...claimedRingSymbols([elementSymbol])];
    }
}


export default IsawaUjina;
