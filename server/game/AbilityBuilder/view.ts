import type { AbilityContext } from '../AbilityContext.js';
import type { Event } from '../Events/Event.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import { createUtils, type Utils } from './Utils.js';

/** Reads the value of one named slot (a cost or a target) from the context that holds it. */
export interface Slot {
    name: string;
    /** The index of the step that owns the slot. Costs are in step 0. */
    step: number;
    read(context: AbilityContext): unknown;
}

type WhenFn = (event: Event, ctx: unknown, util: Utils) => unknown;

/** All slots of an ability, collected while it compiles. */
export class SlotTable {
    costs: Slot[] = [];
    targets: Slot[] = [];
    when: undefined | Record<string, WhenFn>;

    addCost(slot: Slot): void {
        this.assertFree(slot.name);
        this.costs.push(slot);
    }

    addTarget(slot: Slot): void {
        this.assertFree(slot.name);
        this.targets.push(slot);
    }

    private assertFree(name: string): void {
        if(this.costs.some((slot) => slot.name === name) || this.targets.some((slot) => slot.name === name)) {
            throw new Error(`Ability builder: the slot name '${name}' is used more than once`);
        }
    }
}

function defineGetters(slots: Slot[], readSlot: (slot: Slot) => unknown): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for(const slot of slots) {
        Object.defineProperty(result, slot.name, { enumerable: true, get: () => readSlot(slot) });
    }
    return result;
}

/** Extra `ctx` fields, computed when read. */
export type Extras = Record<string, (root: AbilityContext) => unknown>;

/** The typed `ctx` that the callbacks get. It reads the live old contexts. */
export function createView(chain: AbilityContext[], table: SlotTable, extras: Extras = {}): unknown {
    const root = chain[0];
    const current = chain[chain.length - 1];

    const base = createBaseView(root, current);
    const costs = defineGetters(table.costs, (slot) => slot.read(root));
    const targets = defineGetters(table.targets, (slot) => {
        const context = chain[slot.step];
        return context ? slot.read(context) : undefined;
    });

    const view = Object.create(base) as Record<string, unknown>;
    Object.defineProperty(view, 'costs', { value: costs });
    Object.defineProperty(view, 'targets', { value: targets });
    Object.defineProperty(view, 'event', { get: () => (root as TriggeredAbilityContext).event });
    Object.defineProperty(view, 'matched', {
        get: () => {
            const event = (root as TriggeredAbilityContext).event;
            const when = event ? table.when?.[event.name] : undefined;
            return when ? when(event, createBaseView(root, root), createUtils(root)) : undefined;
        }
    });
    for(const [key, read] of Object.entries(extras)) {
        Object.defineProperty(view, key, { get: () => read(root) });
    }
    return view;
}

/** The context without costs and targets: for `when` and for `.condition()`. */
export function createBaseView(root: AbilityContext, current: AbilityContext = root): object {
    return {
        get game() {
            return root.game;
        },
        get player() {
            return root.player;
        },
        get opponent() {
            return root.player.opponent;
        },
        get source() {
            return root.source;
        },
        get conflict() {
            return root.game.currentConflict ?? undefined;
        },
        get raw() {
            return current;
        },
        timesResolved(): number {
            throw new Error('Ability builder: timesResolved is not implemented yet');
        }
    };
}
