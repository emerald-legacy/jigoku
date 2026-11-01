import type { ActionOverrides } from './GameAction.js';
import { msg, type MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { Element, EventName } from '../Constants.js';
import { isEnumValue } from '../utils/helpers.js';
import type { Event } from '../Events/Event.js';
import type Player from '../Player.js';
import type Ring from '../Ring.js';
import type { PromptButton } from '../PlayerPromptState.js';
import { ResolveRingEffectAction, ringEffectIsCancelled } from './ResolveRingEffectAction.js';
import { RingAction, type RingActionProperties } from './RingAction.js';
import type { ActionEvent } from './GameAction.js';

export class ResolveConflictRingAction<Context extends AbilityContext = AbilityContext> extends RingAction<RingActionProperties, EventName.OnResolveConflictRing, Context> {
    override name = 'resolveConflictRing';
    override eventName = EventName.OnResolveConflictRing;

    protected override effectMessage(): MessageArgs {
        return ['resolve {0}', []];
    }

    override addPropertiesToEvent(event: ActionEvent<EventName.OnResolveConflictRing, Context>, ring: Ring, context: Context, additionalProperties: ActionOverrides = {}): void {
        super.addPropertiesToEvent(event, ring, context, additionalProperties);
        const conflict = context.game.currentConflict;

        event.conflict = conflict ?? undefined;
        event.player = context.player;
    }

    // checked before the would-interrupt window, so a cancelled ring effect cannot be replaced (Display of Power)
    override checkEventCondition(event: ActionEvent<EventName.OnResolveConflictRing, Context> & { ring: Ring }, additionalProperties: ActionOverrides = {}): boolean {
        if(!super.checkEventCondition(event, additionalProperties)) {
            return false;
        }
        return !ringEffectIsCancelled(event.context.player);
    }

    override eventHandler(event: ActionEvent<EventName.OnResolveConflictRing, Context>): void {
        if(event.name !== this.eventName) {
            return;
        }

        const elements = event.ring.getElements();
        const player = event.player;
        if(elements.length === 1) {
            this.resolveRingEffects(player, elements);
        } else {
            if(!event.conflict) {
                throw new Error('A ring with several elements can only be resolved during a conflict');
            }
            this.chooseElementsToResolve(player, elements, event.conflict.elementsToResolve);
        }
    }

    chooseElementsToResolve(
        player: Player,
        elements: Element[],
        elementsToResolve: number,
        chosenElements: Element[] = []
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
        const buttons: PromptButton[] = elements.map((element) =>
            ({ text: element.slice(0, 1).toUpperCase() + element.slice(1) + ' Ring', arg: element })
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
            onCancel: (cancelPlayer: Player) => cancelPlayer.game.addMessage(msg`${cancelPlayer} chooses not to resolve the conflict ring`),
            onMenuCommand: (menuPlayer: Player, arg: string) => {
                if(arg === 'all') {
                    this.resolveRingEffects(menuPlayer, elements.concat(chosenElements));
                } else if(isEnumValue(Element, arg) && elements.includes(arg)) {
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

    resolveRingEffects(player: Player, elements: Element[], optional: boolean = true): void {
        const rings = elements.map((element) => player.game.rings[element]);
        const action = new ResolveRingEffectAction({
            target: rings,
            optional: optional,
            physicalRing: player.game.currentConflict?.ring
        });
        const events: Event[] = [];
        action.addEventsToArray(events, player.game.getFrameworkContext(player));
        player.game.openThenEventWindow(events);
    }
}
