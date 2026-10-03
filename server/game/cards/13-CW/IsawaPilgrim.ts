import DrawCard from '../../DrawCard.js';
import { Duration, Element } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { claimedRingSymbols, hasClaimedRing } from '../claimedRings.js';

const elementSymbol = { key: 'isawa-pilgrim-water', element: Element.Water };

class IsawaPilgrim extends DrawCard {
    static id = 'isawa-pilgrim';

    setupCardAbilities() {
        this.action('Give control of this character')
            .condition(context => context.player.opponent !== undefined && hasClaimedRing(this, elementSymbol.key, context.player.opponent))
            .gameAction(AbilityDsl.actions.cardLastingEffect(context => ({
                effect: AbilityDsl.effects.takeControl(context.player.opponent),
                duration: Duration.Custom
            })))
            .effect('give control of itself to {1}', context => [context.player.opponent ?? context.player]);
    }

    getPrintedElementSymbols() {
        return [...super.getPrintedElementSymbols(), ...claimedRingSymbols([elementSymbol])];
    }
}


export default IsawaPilgrim;
