import { msg } from '../../GameChat.js';
import { Location, Duration, Element } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import * as costs from '../../costs/index.js';
import { replacePrintedElement } from '../../effects.js';
import { cardLastingEffect, chooseAction } from '../../GameActions/GameActions.js';
import type { ElementSymbol } from '../../ElementSymbol.js';

export default class TwinSoulTemple extends StrongholdCard {
    static id = 'twin-soul-temple';

    setupCardAbilities() {
        this.action('Bow this stronghold')
            .cost(costs.bowSelf())
            .elementTarget({
                activePromptTitle: 'Choose an element to replace',
                location: [Location.PlayArea, Location.Provinces]
            }, chooseAction((context) => ({
                activePromptTitle: 'Choose the new element',
                choices: Object.fromEntries(this.otherElements(context.element).map((element) => [this.capitalize(element), {
                    action: cardLastingEffect({
                        target: context.elementCard,
                        duration: Duration.UntilEndOfPhase,
                        effect: replacePrintedElement({ key: context.element.key, element })
                    }),
                    message: () => msg`${context.player} replaces ${context.elementCard}'s ${context.element.prettyName} (${this.capitalize(context.element.element)}) symbol with ${this.capitalize(element)}`
                }]))
            })))
            .chatText('replace a printed element symbol with a different one');
    }

    otherElements(element: ElementSymbol): Element[] {
        return [Element.Air, Element.Earth, Element.Fire, Element.Void, Element.Water].filter((e) => e !== element.element);
    }

    capitalize(string: string) {
        return string[0].toUpperCase() + string.substring(1);
    }
}
