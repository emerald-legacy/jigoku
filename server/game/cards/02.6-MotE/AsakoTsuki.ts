import DrawCard from '../../DrawCard.js';
import { honor } from '../../GameActions/GameActions.js';
import { CardType, Element, Trait } from '../../Constants.js';
import { claimedRingSymbols, claimsRingOf } from '../claimedRings.js';

const elementSymbol = { key: 'asako-tsuki-water', element: Element.Water };

class AsakoTsuki extends DrawCard {
    static id = 'asako-tsuki';

    override setupCardAbilities() {
        this.reaction('Honor a scholar character')
            .when({
                onClaimRing: (event) => claimsRingOf(this, elementSymbol.key, event)
            })
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.hasTrait(Trait.Scholar)
            }, honor());
    }

    override getPrintedElementSymbols() {
        return [...super.getPrintedElementSymbols(), ...claimedRingSymbols([elementSymbol])];
    }
}


export default AsakoTsuki;
