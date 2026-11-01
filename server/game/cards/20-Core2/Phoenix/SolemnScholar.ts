import { CardType, Element } from '../../../Constants.js';
import { bow } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { claimedRingSymbols, hasClaimedRing } from '../../claimedRings.js';

const elementSymbol = { key: 'solemn-scholar-earth', element: Element.Earth };

export default class SolemnScholar extends DrawCard {
    static id = 'solemn-scholar';

    override setupCardAbilities() {
        this.conflictAction('Bow an attacking character', { evenFromHome: true })
            .ifCondition((context) => hasClaimedRing(this, elementSymbol.key, context.player))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isAttacking()
            }, bow());
    }

    protected override printedElementSymbols = claimedRingSymbols([elementSymbol]);
}
