import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../BaseCard.js';
import { CardType, Location } from '../../Constants.js';
import type DrawCard from '../../DrawCard.js';
import type { Event } from '../../Events/Event.js';
import type { GameAction } from '../../GameActions/GameAction.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';
import { costKit, type CostSpec } from '../kits/CostKit.js';
import { createEffectKit, nodeActions } from '../kits/EffectKit.js';
import type { FinishOptions } from '../kits/LimitKit.js';
import { formatted, messageKit, messageList, type MessageResult } from '../kits/MessageKit.js';
import { targetKit, type LegacyTarget, type TargetSpec } from '../kits/TargetKit.js';
import type { AbilitySpec, StepSpec, Zone } from '../TriggeredBuilder.js';
import { createUtils } from '../Utils.js';
import { createBaseView, createView, SlotTable } from '../view.js';
import { EffectsAction } from './EffectsAction.js';

type Props = Record<string, unknown>;
type Slots = [string, TargetSpec<unknown>][];

const ZONE_LOCATION: Record<Zone, Location> = {
    hand: Location.Hand,
    playArea: Location.PlayArea,
    provinces: Location.Provinces,
    dynastyDiscardPile: Location.DynastyDiscardPile,
    conflictDiscardPile: Location.ConflictDiscardPile,
    dynastyDeck: Location.DynastyDeck,
    conflictDeck: Location.ConflictDeck,
    removedFromGame: Location.RemovedFromGame
};

type Call<F> = F extends (...args: never[]) => infer R ? (...args: unknown[]) => R : never;

function call<F extends (...args: never[]) => unknown>(fn: F): Call<F> {
    return fn as unknown as Call<F>;
}

function verb(source: BaseCard): string {
    return source.type === CardType.Event ? 'plays' : 'uses';
}

/** The direct targets of an old action. Wrapper actions have none. */
function directTargets(action: GameAction, context: AbilityContext): unknown[] {
    const target = action.getProperties(context).target;
    return Array.isArray(target) ? target : [];
}

/**
 * "Conflict Action", with the RRG meaning for the type of `card`: the card with the printed text,
 * or the card that gains the ability.
 */
function conflictCondition(
    context: AbilityContext,
    type: undefined | 'military' | 'political',
    card: BaseCard
): boolean {
    if(!context.game.isDuringConflict(type ?? null)) {
        return false;
    }
    const source = card;
    if(source.type === CardType.Character) {
        return (source as DrawCard).isParticipating(type);
    }
    if(source.type === CardType.Attachment && source.location !== Location.Hand) {
        return Boolean((source as DrawCard).parentCharacter?.isParticipating(type));
    }
    return true;
}

/** Compiles a recorded triggered ability into the props of the old API. */
export class TriggeredCompiler {
    private readonly table = new SlotTable();
    private readonly costs: [string, CostSpec<unknown>][];
    private readonly slots: Slots[];

    constructor(
        private readonly card: BaseCard,
        private readonly spec: AbilitySpec,
        /** A gained ability belongs to the card that gains it, not to `card`. */
        private readonly gained = false
    ) {
        this.table.when = spec.when as SlotTable['when'];
        if(spec.kind === 'duelChallenge' || spec.kind === 'duelFocus' || spec.kind === 'duelStrike') {
            // The duel window abilities read the duel that is resolving.
            this.table.extras = { duel: (root) => (root as TriggeredAbilityContext).event.duel };
        }

        this.costs = Object.entries(spec.costs ? call(spec.costs)(costKit) : {});
        for(const [name, cost] of this.costs) {
            this.table.addCost({ name, step: 0, read: (context) => cost.read(context) });
        }

        let position = 0;
        this.slots = spec.steps.map((step, index) => {
            if(index > 0 && step.gate.type !== 'otherwise') {
                position++;
            }
            const slots = step.targetGroups.flatMap((group) => Object.entries(call(group)(targetKit)));
            for(const [name, target] of slots) {
                this.table.addTarget({ name, step: position, read: (context) => target.read(context, name) });
            }
            return slots;
        });

        for(const [index, step] of spec.steps.entries()) {
            if(step.gate.type === 'otherwise' && (step.targetGroups.length > 0 || this.slots[index - 1].length > 0)) {
                throw new Error('Ability builder: a branch with otherwise() cannot choose targets yet');
            }
        }
    }

    compile(limits: FinishOptions): Props {
        const spec = this.spec;
        const props: Props = {
            title: spec.title ?? this.card.name,
            ...this.stepProps(0, []),
            ...this.rootMessage(),
            ...limits
        };

        if(spec.when) {
            props.when = Object.fromEntries(
                Object.entries(spec.when).map(([name, when]) => [
                    name,
                    (event: Event, context: AbilityContext) =>
                        Boolean(call(when)(event, createBaseView(context), createUtils(context)))
                ])
            );
        }

        const conflict = spec.conflict;
        if(conflict || spec.conditions.length > 0) {
            props.condition = (context: AbilityContext) =>
                (!conflict ||
                    conflictCondition(
                        context,
                        conflict.type,
                        this.gained ? (context.source) : this.card
                    )) &&
                spec.conditions.every((condition) =>
                    call(condition)(createView([context], this.table), createUtils(context))
                );
        }
        if(spec.zones) {
            props.location = spec.zones.map((zone) => ZONE_LOCATION[zone]);
        }
        if(spec.phase) {
            props.phase = spec.phase;
        }
        if(spec.costsFirst) {
            props.cannotTargetFirst = true;
        }
        if(this.costs.length > 0) {
            const env = { view: (context: AbilityContext) => createView([context], this.table), util: createUtils };
            props.cost = this.costs.map(([, cost]) => cost.compile(env));
        }

        const then = this.thenProps(1, []);
        if(then) {
            props.then = then;
        }
        return props;
    }

    /** The first step prints its announcement as the effect text after the standard intro. */
    private rootMessage(): Props {
        const step = this.spec.steps[0];
        if(!step.announce) {
            return {};
        }
        const announce = step.announce;
        return {
            effect: '{1}',
            effectArgs: (context: AbilityContext) => {
                const [intro, ...rest] = messageList(this.announcement(announce, [context]));
                if(rest.length > 0) {
                    context.game.queueSimpleStep(() => {
                        for(const message of rest) {
                            context.game.addMessage('{0}', formatted(context.game, message));
                        }
                    });
                }
                return intro ? [formatted(context.game, intro)] : [];
            }
        };
    }

    private announcement(announce: NonNullable<StepSpec['announce']>, chain: AbilityContext[]): MessageResult {
        const context = chain[chain.length - 1];
        return call(announce)(messageKit, createView(chain, this.table), createUtils(context));
    }

    /** Prints the announcement of a later step. */
    private printStepMessages(announce: NonNullable<StepSpec['announce']>, chain: AbilityContext[]): void {
        const context = chain[chain.length - 1];
        const game = context.game;
        for(const message of messageList(this.announcement(announce, chain))) {
            if(message.kind === 'intro') {
                game.addMessage(
                    '{0} {1} {2} to {3}',
                    context.player,
                    verb(context.source),
                    context.source,
                    formatted(game, message)
                );
            } else {
                game.addMessage('{0}', formatted(game, message));
            }
        }
    }

    private effectsAction(
        step: StepSpec,
        slots: Slots,
        chain: (context: AbilityContext) => AbilityContext[]
    ): undefined | EffectsAction {
        const effects = step.effects;
        if(!effects) {
            return undefined;
        }
        return new EffectsAction(
            (context) => this.actionsOf(effects, chain(context)),
            (context, actions) => this.chosenCardsCanBeAffected(slots, context, actions)
        );
    }

    private actionsOf(effects: NonNullable<StepSpec['effects']>, chain: AbilityContext[]): GameAction[] {
        const context = chain[chain.length - 1];
        const nodes = call(effects)(
            createEffectKit(context),
            createView(chain, this.table),
            createUtils(context)
        );
        return nodeActions(nodes);
    }

    /** RRG "Target": a chosen card must be affected by the effects, unless it is only a reference. */
    private chosenCardsCanBeAffected(slots: Slots, context: AbilityContext, actions: readonly GameAction[]): boolean {
        const cards = slots.flatMap(([name, target]) => target.chosenCards(context, name));
        return cards.every((card) => {
            const targeting = actions.filter((action) => directTargets(action, context).includes(card));
            return targeting.length === 0 || targeting.some((action) => action.canAffect(card, context));
        });
    }

    /** The targets and effects of one step. */
    private stepProps(index: number, parentChain: AbilityContext[]): Props {
        const step = this.spec.steps[index];
        const slots = this.slots[index];
        const chain = (context: AbilityContext) => [...parentChain, context];

        const env = {
            owner: this.card.owner,
            sourceIsCharacter: this.gained || this.card.type === CardType.Character,
            view: (context: AbilityContext) => createView(chain(context), this.table),
            util: createUtils
        };
        const targets: LegacyTarget[] = slots.flatMap(([name, target]) => target.compile(name, env));
        for(const [position, target] of targets.entries()) {
            if(position > 0) {
                target.props.dependsOn = targets[position - 1].name;
            }
        }

        const effects = this.effectsAction(step, slots, chain);
        const last = targets[targets.length - 1];
        if(!last) {
            return effects ? { gameAction: effects } : {};
        }
        if(effects && last.kind === 'select') {
            const choices = last.props.choices as Record<string, unknown>;
            for(const label of Object.keys(choices)) {
                choices[label] = effects;
            }
        } else if(effects) {
            last.props.gameAction = [effects];
        }
        return { targets: Object.fromEntries(targets.map((target) => [target.name, target.props])) };
    }

    /** The `then` of the old API: builds the next step when the previous step resolves. */
    private thenProps(index: number, parentChain: AbilityContext[]): undefined | ((context: AbilityContext) => Props) {
        const step = this.spec.steps[index];
        if(!step) {
            return undefined;
        }
        const otherwise =
            this.spec.steps[index + 1]?.gate.type === 'otherwise' ? this.spec.steps[index + 1] : undefined;
        const after = otherwise ? index + 2 : index + 1;

        return (parentContext: AbilityContext) => {
            const chain = [...parentChain, parentContext];
            const props = otherwise
                ? this.branchProps(step, otherwise, chain)
                : this.singleStepProps(index, step, chain);
            const then = this.thenProps(after, chain);
            if(then) {
                props.then = then;
            }
            return props;
        };
    }

    private singleStepProps(index: number, step: StepSpec, chain: AbilityContext[]): Props {
        const props: Props = { ...this.stepProps(index, chain) };
        const gate = step.gate;
        if(gate.type === 'then') {
            props.thenCondition = () => true;
        } else if(gate.type === 'thenIf') {
            props.thenCondition = () => this.gateCondition(gate.condition, chain);
        }
        const announce = step.announce;
        if(announce) {
            props.message = (context: AbilityContext) => {
                this.printStepMessages(announce, [...chain, context]);
                return '';
            };
        }
        return props;
    }

    /** "If you do / Then, if ... Otherwise, ...": one old then-ability that picks the branch when it resolves. */
    private branchProps(step: StepSpec, otherwise: StepSpec, chain: AbilityContext[]): Props {
        const gate = step.gate;
        const parent = chain[chain.length - 1];
        const taken = () =>
            gate.type === 'thenIf'
                ? this.gateCondition(gate.condition, chain)
                : parent.events.length > 0 && parent.events.every((event) => event.isFullyResolved());

        const branch = () => (taken() ? step : otherwise);
        return {
            thenCondition: () => true,
            gameAction: new EffectsAction((context) => {
                const effects = branch().effects;
                return effects ? this.actionsOf(effects, [...chain, context]) : [];
            }),
            message: (context: AbilityContext) => {
                const announce = branch().announce;
                if(announce) {
                    this.printStepMessages(announce, [...chain, context]);
                }
                return '';
            }
        };
    }

    private gateCondition(condition: (...args: never[]) => boolean, chain: AbilityContext[]): boolean {
        const context = chain[chain.length - 1];
        return call(condition)(createEffectKit(context), createView(chain, this.table), createUtils(context));
    }
}
