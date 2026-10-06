import DrawCard from '../../DrawCard.js';
import { honor } from '../../GameActions/GameActions.js';
import { CardType, Element } from '../../Constants.js';
import { claimedRingSymbols, claimsRingOf } from '../claimedRings.js';

const elementSymbol = { key: 'asako-tsuki-water', element: Element.Water };

class AsakoTsuki extends DrawCard {
    static id = 'asako-tsuki';

    setupCardAbilities() {
        this.reaction('Honor a scholar character')
            .when({
                onClaimRing: (event) => claimsRingOf(this, elementSymbol.key, event)
            })
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.hasTrait('scholar')
            }, honor());
    }

    getPrintedElementSymbols() {
        return [...super.getPrintedElementSymbols(), ...claimedRingSymbols([elementSymbol])];
    }
}


export default AsakoTsuki;
