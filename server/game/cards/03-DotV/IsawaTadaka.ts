import DrawCard from '../../DrawCard.js';
import { Players, Element, RestrictionType, RestrictionScope } from '../../Constants.js';
import { playerCannot } from '../../effects.js';
import { claimedRingSymbols, hasClaimedRing } from '../claimedRings.js';

const elementSymbol = { key: 'isawa-tadaka-earth', element: Element.Earth };

class IsawaTadaka extends DrawCard {
    static id = 'isawa-tadaka';

    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Opponent,
            condition: (context) => context.player.opponent === undefined || !hasClaimedRing(this, elementSymbol.key, context.player.opponent),
            effect: playerCannot({
                cannot: RestrictionType.Play,
                appliesTo: RestrictionScope.CopiesOfDiscardEvents
            })
        });
    }

    getPrintedElementSymbols() {
        return [...super.getPrintedElementSymbols(), ...claimedRingSymbols([elementSymbol])];
    }
}


export default IsawaTadaka;
