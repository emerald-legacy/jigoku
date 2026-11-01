import { msg } from '../GameChat.js';
import type { ActionOverrides } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EffectName, EventName } from '../Constants.js';
import { Event } from '../Events/Event.js';
import type Player from '../Player.js';
import Ring from '../Ring.js';
import { RingAbilities } from '../RingAbilities.js';
import { RingAction, type RingActionProperties } from './RingAction.js';
import { targetList, type ActionEvent } from './GameAction.js';

export interface ResolveRingEffectProperties extends RingActionProperties {
    physicalRing?: Ring;
    player?: Player;
    enforceOrderedResolution?: boolean;
}

export class ResolveRingEffectAction<Context extends AbilityContext = AbilityContext> extends RingAction<ResolveRingEffectProperties, EventName.OnResolveRingElement, Context> {
    override name = 'resolveRingEffect';
    override eventName = EventName.OnResolveRingElement;
    override effect = 'resolve {0} effect';

    override addEventsToArray(events: Event[], context: Context, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        const rings = targetList(properties.target).flatMap((ring) => ring instanceof Ring ? [ring] : []);

        if(rings.length === 1) {
            events.push(this.getEvent(rings[0], context, additionalProperties));
            return;
        }

        if(rings.length > 1) {
            const sortedRings = properties.enforceOrderedResolution
                ? rings
                : RingAbilities.sortedForResolution(
                    context.player,
                    rings,
                    (ring) => RingAbilities.contextFor(context.player, ring.element).ability.defaultPriority
                );
            // RRG Ring Effects: the player resolves (or passes on) each effect in turn, in the order they choose
            const ringProperties = { ...additionalProperties, optional: true };
            const resolvingPlayer = properties.player ?? context.player;
            const ringEvents: Event[] = [];
            const effectObjects = sortedRings.map((ring) => ({
                title: ring.name + ' Effect',
                player: resolvingPlayer,
                handler: () => {
                    const ringEvent = this.getEvent(ring, context, ringProperties);
                    ringEvents.push(ringEvent);
                    context.game.openEventWindow(ringEvent);
                }
            }));
            // an order the card already fixed (Riddles of the Henshin) is kept
            const event = new Event(EventName.Unnamed, { context }, () => properties.enforceOrderedResolution
                ? effectObjects.forEach((effect) => effect.handler())
                : context.game.openSimultaneousEffectWindow(effectObjects));
            // resolved in full unless a ring effect was cancelled (a replaced one counts)
            event.checkFullyResolved = (wrapper) => !wrapper.cancelled && ringEvents.every((ringEvent) => !ringEvent.getResolutionEvent().cancelled);
            events.push(event);
        }
    }

    override addPropertiesToEvent(event: ActionEvent<EventName.OnResolveRingElement, Context>, ring: Ring, context: Context, additionalProperties: ActionOverrides): void {
        const { physicalRing, optional, player } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, ring, context, additionalProperties);
        event.player = player || context.player;
        event.physicalRing = physicalRing;
        event.optional = optional;
        event.effectResolved = false;
    }

    // checked before the would-interrupt window, so a cancelled ring effect cannot be replaced (ruling #636)
    override checkEventCondition(event: ActionEvent<EventName.OnResolveRingElement, Context> & { ring: Ring }, additionalProperties: ActionOverrides = {}): boolean {
        if(!super.checkEventCondition(event, additionalProperties)) {
            return false;
        }
        return !ringEffectIsCancelled(event.context.player);
    }

    override eventHandler(event: ActionEvent<EventName.OnResolveRingElement, Context>): void {
        event.context.game.resolveAbility(
            RingAbilities.contextFor(event.player, event.ring.element, event.optional, (resolved) => {
                event.effectResolved = resolved;
            })
        );
    }
}

/** Mountaintop Vigil: checked in the event's condition, before its would-interrupt window (ruling #636). */
export function ringEffectIsCancelled(player: Player): boolean {
    if(!player.anyEffect(EffectName.CannotResolveRings)) {
        return false;
    }
    player.game.addMessage(msg`${player}'s ring effect is cancelled`);
    return true;
}
