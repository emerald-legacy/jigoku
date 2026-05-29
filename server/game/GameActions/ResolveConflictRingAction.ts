import type { AbilityContext } from '../AbilityContext.js';
import { EffectNames, EventNames } from '../Constants.js';
import type { Event } from '../Events/Event.js';
import type Player from '../Player.js';
import type Ring from '../Ring.js';
import { ResolveElementAction } from './ResolveElementAction.js';
import { RingAction, type RingActionProperties } from './RingAction.js';

export class ResolveConflictRingAction extends RingAction {
    name = 'resolveRing';
    eventName = EventNames.OnResolveConflictRing;
    constructor(properties: ((context: AbilityContext) => RingActionProperties) | RingActionProperties) {
        super(properties);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties: RingActionProperties = this.getProperties(context);
        return ['resolve {0}', [properties.target]];
    }

    addPropertiesToEvent(event: Event, ring: Ring, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        super.addPropertiesToEvent(event, ring, context, additionalProperties);
        let conflict = context.game.currentConflict;

        event.conflict = conflict;
        event.player = context.player;
    }

    eventHandler(event: Event): void {
        if(event.name !== this.eventName) {
            return;
        }

        const eventContext = event.context as AbilityContext;
        const cannotResolveRingEffects = eventContext.player.getEffects(EffectNames.CannotResolveRings);

        if(cannotResolveRingEffects.length) {
            eventContext.game.addMessage('{0}\'s ring effect is cancelled.', eventContext.player);
            event.cancel();
            return;
        }

        let elements = event.ring.getElements();
        let player = event.player;
        if(elements.length === 1) {
            this.resolveRingEffects(player, elements);
        } else {
            this.chooseElementsToResolve(player, elements, event.conflict.elementsToResolve);
        }
    }

    chooseElementsToResolve(
        player: Player,
        elements: string[],
        elementsToResolve: number,
        chosenElements: string[] = []
    ): void {
        if(elements.length === 0 || elementsToResolve === 0) {
            this.resolveRingEffects(player, chosenElements);
            return;
        }
        let activePromptTitle = 'Choose a ring effect to resolve (click the ring you want to resolve)';
        if(chosenElements.length > 0) {
            activePromptTitle = chosenElements.reduce(
                (string, element) => string + ' ' + element,
                activePromptTitle + '\nChosen elements:'
            );
        }
        let buttons = [];

        elements.map((element) =>
            buttons.push({ text: element.slice(0, 1).toUpperCase() + element.slice(1) + ' Ring', arg: element })
        );
        if(chosenElements.length > 0) {
            buttons.push({ text: 'Done', arg: 'done' });
        }
        if(elementsToResolve >= elements.length) {
            buttons.push({ text: 'Resolve All Elements', arg: 'all' });
        }
        buttons.push({ text: 'Don\'t Resolve the Conflict Ring', arg: 'cancel' });

        player.game.promptForRingSelect(player, {
            activePromptTitle: activePromptTitle,
            buttons: buttons,
            source: 'Resolve Ring Effect',
            ringCondition: (ring: Ring) => elements.includes(ring.element),
            onSelect: (selectingPlayer: Player, ring: Ring) => {
                elementsToResolve--;
                chosenElements.push(ring.element);
                this.chooseElementsToResolve(
                    selectingPlayer,
                    elements.filter((e) => e !== ring.element),
                    elementsToResolve,
                    chosenElements
                );
                return true;
            },
            onCancel: (cancelPlayer: Player) => cancelPlayer.game.addMessage('{0} chooses not to resolve the conflict ring', cancelPlayer),
            onMenuCommand: (menuPlayer: Player, arg: string) => {
                if(arg === 'all') {
                    this.resolveRingEffects(menuPlayer, elements.concat(chosenElements));
                } else if(elements.includes(arg)) {
                    elementsToResolve--;
                    chosenElements.push(arg);
                    this.chooseElementsToResolve(
                        menuPlayer,
                        elements.filter((e) => e !== arg),
                        elementsToResolve,
                        chosenElements
                    );
                } else if(arg === 'done') {
                    this.resolveRingEffects(menuPlayer, chosenElements);
                }
                return true;
            }
        });
    }

    resolveRingEffects(player: Player, elements: string[], optional: boolean = true): void {
        if(!Array.isArray(elements)) {
            elements = [elements];
        }
        let rings = elements.map((element) => player.game.rings[element]);
        let action = new ResolveElementAction({
            target: rings,
            optional: optional,
            physicalRing: player.game.currentConflict?.ring
        });
        const events: Event[] = [];
        action.addEventsToArray(events, player.game.getFrameworkContext(player));
        player.game.openThenEventWindow(events);
    }
}
