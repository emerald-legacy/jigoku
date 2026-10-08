import { msg } from '../../GameChat.js';
import { Location, Duration, Element } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import * as costs from '../../costs/index.js';
import { replacePrintedElement } from '../../effects.js';
import { cardLastingEffect, menuPrompt } from '../../GameActions/GameActions.js';
import type { ElementSymbol } from '../../ElementSymbol.js';
import { isEnumValue } from '../../utils/helpers.js';

export default class TwinSoulTemple extends StrongholdCard {
    static id = 'twin-soul-temple';

    setupCardAbilities() {
        this.action('Bow this stronghold')
            .cost(costs.bowSelf())
            .elementTarget({
                activePromptTitle: 'Choose an element to replace',
                location: [Location.PlayArea, Location.Provinces]
            }, menuPrompt((context) => ({
                activePromptTitle: 'Choose the new element',
                choices: this.getChoices(context.element),
                gameAction: cardLastingEffect({
                    target: context.elementCard,
                    duration: Duration.UntilEndOfPhase
                }),
                choiceHandler: (choice, displayMessage) => {
                    const newElement = choice.toLowerCase();
                    if(!isEnumValue(Element, newElement)) {
                        return {};
                    }
                    if(displayMessage) {
                        this.game.addMessage(msg`${context.player} replaces ${context.elementCard}'s ${context.element.prettyName} (${this.capitalize(context.element.element)}) symbol with ${this.capitalize(newElement)}`);
                    }
                    return {
                        effect: replacePrintedElement({
                            key: context.element.key,
                            element: newElement
                        })
                    };
                }
            })))
            .chatText('replace a printed element symbol with a different one');
    }

    getChoices(element: ElementSymbol): string[] {
        return [Element.Air, Element.Earth, Element.Fire, Element.Void, Element.Water]
            .filter((e) => e !== element.element)
            .map((e) => this.capitalize(e));
    }

    capitalize(string: string) {
        return string[0].toUpperCase() + string.substring(1);
    }
}
