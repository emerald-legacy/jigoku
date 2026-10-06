import { CardType, Element } from '../../../Constants.js';
import { bow } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { claimedRingSymbols, hasClaimedRing } from '../../claimedRings.js';

const elementSymbol = { key: 'solemn-scholar-earth', element: Element.Earth };

export default class SolemnScholar extends DrawCard {
    static id = 'solemn-scholar';

    setupCardAbilities() {
        this.action('Bow an attacking character')
            .condition((context) => hasClaimedRing(this, elementSymbol.key, context.player))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isAttacking()
            }, bow());
    }

    getPrintedElementSymbols() {
        return [...super.getPrintedElementSymbols(), ...claimedRingSymbols([elementSymbol])];
    }
}
