import DrawCard from '../../DrawCard.js';
import { CardType, Element } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
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
            }, AbilityDsl.actions.removeFromGame())
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }

    getPrintedElementSymbols() {
        return [...super.getPrintedElementSymbols(), ...claimedRingSymbols([elementSymbol])];
    }
}


export default IsawaUjina;
