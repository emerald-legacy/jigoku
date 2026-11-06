import { ready } from '../../../GameActions/GameActions.js';
import { CardType, Element, Trait } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { claimsRingOf } from '../../claimedRings.js';

const RING_CLAIM = 'henshin-seeker-fire';

export default class HenshinSeeker extends DrawCard {
    static id = 'henshin-seeker';

    override setupCardAbilities() {
        this.reaction('Ready a character')
            .when({
                onClaimRing: (event) => claimsRingOf(this, RING_CLAIM, event)
            })
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.hasSomeTrait(Trait.Scholar, Trait.Monk)
            }, ready());
    }

    protected override printedElementSymbols = [
        { key: RING_CLAIM, prettyName: 'Ring', element: Element.Fire }
    ];
}
