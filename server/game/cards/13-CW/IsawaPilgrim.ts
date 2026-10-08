import DrawCard from '../../DrawCard.js';
import { Duration, Element } from '../../Constants.js';
import { takeControl } from '../../effects.js';
import { claimedRingSymbols, hasClaimedRing } from '../claimedRings.js';
import { msg } from '../../GameChat.js';

const elementSymbol = { key: 'isawa-pilgrim-water', element: Element.Water };

class IsawaPilgrim extends DrawCard {
    static id = 'isawa-pilgrim';

    setupCardAbilities() {
        this.action('Give control of this character')
            .condition(context => context.player.opponent !== undefined && hasClaimedRing(this, elementSymbol.key, context.player.opponent))
            .cardLastingEffect(context => ({
                effect: takeControl(context.player.opponent),
                duration: Duration.Custom
            }))
            .chatText((context) => msg`give control of itself to ${context.player.opponent ?? context.player}`);
    }

    getPrintedElementSymbols() {
        return [...super.getPrintedElementSymbols(), ...claimedRingSymbols([elementSymbol])];
    }
}


export default IsawaPilgrim;
