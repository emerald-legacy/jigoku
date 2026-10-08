import DrawCard from '../../DrawCard.js';
import { Players, CardType, Element } from '../../Constants.js';
import { addKeyword } from '../../effects.js';
import { claimedRingSymbols, hasClaimedRing } from '../claimedRings.js';

const elementSymbol = { key: 'alchemical-laboratory-fire', element: Element.Fire };

class AlchemicalLaboratory extends DrawCard {
    static id = 'alchemical-laboratory';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => hasClaimedRing(this, elementSymbol.key, context.player),
            match: (card, context) => card.getType() === CardType.Attachment && card.parentCharacter !== null && card.parentCharacter !== undefined && card.parentCharacter.controller !== context?.player,
            effect: addKeyword('ancestral'),
            targetController: Players.Self
        });
    }

    getPrintedElementSymbols() {
        return [...super.getPrintedElementSymbols(), ...claimedRingSymbols([elementSymbol])];
    }
}


export default AlchemicalLaboratory;
