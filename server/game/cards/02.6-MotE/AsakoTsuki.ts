import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
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
            }, AbilityDsl.actions.honor());
    }

    getPrintedElementSymbols() {
        return [...super.getPrintedElementSymbols(), ...claimedRingSymbols([elementSymbol])];
    }
}


export default AsakoTsuki;
