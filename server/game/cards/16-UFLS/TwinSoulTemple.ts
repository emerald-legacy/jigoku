import { TargetMode, Location, Duration, Element } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';
import type { ElementSymbol } from '../../ElementSymbol.js';

export default class TwinSoulTemple extends StrongholdCard {
    static id = 'twin-soul-temple';

    setupCardAbilities() {
        this.action({
            title: 'Bow this stronghold',
            cost: AbilityDsl.costs.bowSelf(),
            target: {
                activePromptTitle: 'Choose an element to replace',
                mode: TargetMode.ElementSymbol,
                location: [Location.PlayArea, Location.Provinces],
                gameAction: AbilityDsl.actions.menuPrompt((context) => ({
                    activePromptTitle: 'Choose the new element',
                    choices: this.getChoices(context),
                    gameAction: AbilityDsl.actions.cardLastingEffect({
                        target: context.elementCard,
                        duration: Duration.UntilEndOfPhase
                    }),
                    choiceHandler: (choice, displayMessage) => {
                        let newElement = choice.toLowerCase();
                        if(displayMessage) {
                            this.game.addMessage(
                                '{0} replaces {1}\'s {2} ({3}) symbol with {4}',
                                context.player,
                                context.elementCard,
                                context.element.prettyName,
                                this.capitalize(context.element.element),
                                this.capitalize(newElement)
                            );
                        }
                        return {
                            effect: AbilityDsl.effects.replacePrintedElement({
                                key: context.element.key,
                                element: newElement
                            })
                        };
                    }
                }))
            },
            effect: 'replace a printed element symbol with a different one'
        });
    }

    getChoices(context: { element: ElementSymbol }) {
        let els = [Element.Air, Element.Earth, Element.Fire, Element.Void, Element.Water];
        let currentEl = context.element.element;

        const index = els.indexOf(currentEl);
        if(index > -1) {
            els.splice(index, 1);
        }
        els.forEach((e, i) => (els[i] = this.capitalize(e) as Element));
        return els;
    }

    capitalize(string: string) {
        return string[0].toUpperCase() + string.substring(1);
    }
}
