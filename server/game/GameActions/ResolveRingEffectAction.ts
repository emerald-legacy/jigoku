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

export interface ResolveElementProperties extends RingActionProperties {
    physicalRing?: Ring;
    player?: Player;
    enforceOrderedResolution?: boolean;
}

export class ResolveRingEffectAction<Context extends AbilityContext = AbilityContext> extends RingAction<ResolveElementProperties, EventName.OnResolveRingElement, Context> {
    override name = 'resolveRingEffect';
    override eventName = EventName.OnResolveRingElement;
    override effect = 'resolve {0} effect';

    override addEventsToArray(events: Event[], context: Context, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        const rings = targetList(properties.target).flatMap((element) => {
            if(typeof element === 'string') {
                const ring = context.game.rings[element];
                return ring ? [ring] : [];
            }
            if(element instanceof Ring) {
                return [element];
            }
            return [];
        });

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
            const ringProperties = { ...additionalProperties, optional: false };
            const ringEvents: Event[] = [];
            const effectObjects = sortedRings.map((ring) => ({
                title: RingAbilities.getRingName(ring.element) + ' Effect',
                handler: () => {
                    const ringEvent = this.getEvent(ring, context, ringProperties);
                    ringEvents.push(ringEvent);
                    context.game.openEventWindow(ringEvent);
                }
            }));
            const event = new Event(EventName.Unnamed, { context }, () => context.game.openSimultaneousEffectWindow(effectObjects));
            // resolved in full unless a ring effect was cancelled (a replaced one counts)
            event.checkFullyResolved = (wrapper) => !wrapper.cancelled && ringEvents.every((ringEvent) => !ringEvent.getResolutionEvent().cancelled);
            events.push(event);
        }
    }

    override addPropertiesToEvent(event: ActionEvent<EventName.OnResolveRingElement, Context>, ring: Ring, context: Context, additionalProperties: Record<string, unknown>): void {
        const { physicalRing, optional, player } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, ring, context, additionalProperties);
        event.player = player || context.player;
        event.physicalRing = physicalRing;
        event.optional = optional;
        event.effectResolved = false;
    }

    override eventHandler(event: ActionEvent<EventName.OnResolveRingElement, Context>): void {
        const context = event.context;
        const cannotResolveRingEffects = context.player.getEffects(EffectName.CannotResolveRings);

        if(cannotResolveRingEffects.length) {
            context.game.addMessage(msg`${context.player}'s ring effect is cancelled`);
            event.cancel();
            return;
        }

        context.game.resolveAbility(
            RingAbilities.contextFor(event.player, event.ring.element, event.optional, (resolved) => {
                event.effectResolved = resolved;
            })
        );
    }
}
