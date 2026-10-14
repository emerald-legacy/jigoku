import { AbilityType, EffectName, type Location } from '../../Constants.js';
import type {
    ActionProps,
    PersistentEffectProps,
    TargetLocation,
    TriggeredAbilityProps,
    TriggeredAbilityWhenProps
} from '../../Interfaces.js';
import { AbilityBuilder, TriggerBuilder, createDraft, holdsAggregateEvents, holdsTriggerEvent, toActionProps, toAggregateProps, toTriggerProps, type ActionContext } from '../../AbilityBuilder.js';
import { CardAction } from '../../CardAction.js';
import type BaseCard from '../../BaseCard.js';
import type { CardAbility } from '../../CardAbility.js';
import type DrawCard from '../../DrawCard.js';
import type { ConflictActionOptions } from '../../DrawCard.js';
import { EffectBuilder, type EffectTarget } from '../EffectBuilder.js';
import { GainAbility, type GainAbilityArgs } from '../GainAbility.js';

type Res = ReturnType<typeof EffectBuilder.card.static>;

export function gainAbility(abilityType: AbilityType, ability: CardAbility): Res;

export function gainAbility<Source extends BaseCard = DrawCard>(abilityType: AbilityType.Action, properties: ActionProps<Source>): Res;

export function gainAbility<Source extends BaseCard = DrawCard>(abilityType: AbilityType.DuelReaction, properties: TriggeredAbilityWhenProps<Source>): Res;

export function gainAbility<Source extends BaseCard = DrawCard, T extends EffectTarget = EffectTarget, L extends TargetLocation = Location.PlayArea>(abilityType: AbilityType.Persistent, properties: PersistentEffectProps<Source, T, L>): Res;

export function gainAbility<Source extends BaseCard = DrawCard>(abilityType: AbilityType.Reaction, properties: TriggeredAbilityProps<Source>): Res;

export function gainAbility<Source extends BaseCard = DrawCard>(abilityType: AbilityType.WouldInterrupt, properties: TriggeredAbilityProps<Source>): Res;

export function gainAbility<Source extends BaseCard = DrawCard>(abilityType: AbilityType.Interrupt, properties: TriggeredAbilityProps<Source>): Res;

export function gainAbility<Source extends BaseCard = DrawCard>(abilityType: AbilityType.ForcedReaction, properties: TriggeredAbilityProps<Source>): Res;

export function gainAbility<Source extends BaseCard = DrawCard>(abilityType: AbilityType.ForcedInterrupt, properties: TriggeredAbilityProps<Source>): Res;

export function gainAbility(...args: GainAbilityArgs) {
    return EffectBuilder.card.static(EffectName.GainAbility, new GainAbility(...args));
}

function rejectPlayCondition(draft: { title: string; playCondition?: unknown }): void {
    if(draft.playCondition) {
        throw new Error(`${draft.title}: a gained ability can't restrict playing the card`);
    }
}

function gainedActionProps(title: string, build: (ability: AbilityBuilder<ActionContext<DrawCard>>) => unknown): ActionProps<DrawCard> {
    const draft = createDraft(title, (context) => context.ability instanceof CardAction);
    build(new AbilityBuilder<ActionContext<DrawCard>>(draft));
    rejectPlayCondition(draft);
    return toActionProps<DrawCard>(draft);
}

/** Grants an action written with the builder; `context.source` is the card that gains it. */
gainAbility.action = function(title: string, build: (ability: AbilityBuilder<ActionContext<DrawCard>>) => unknown): Res {
    return gainAbility(AbilityType.Action, gainedActionProps(title, build));
};

/** Grants a "Conflict Action", with the rules of the card's own `conflictAction(title, options)`. */
gainAbility.conflictAction = function(title: string, build: (ability: AbilityBuilder<ActionContext<DrawCard>>) => unknown, options: ConflictActionOptions = {}): Res {
    const properties = gainedActionProps(title, build);
    const condition = properties.condition;
    return gainAbility(AbilityType.Action, {
        ...properties,
        condition: (context) => context.source.allowsConflictAction(options) && (condition?.(context) ?? true)
    });
};

function gainedTrigger(abilityType: AbilityType.Reaction | AbilityType.Interrupt | AbilityType.WouldInterrupt | AbilityType.ForcedReaction | AbilityType.ForcedInterrupt) {
    return (title: string, build: (ability: TriggerBuilder<DrawCard>) => unknown): Res => {
        let properties: (() => TriggeredAbilityProps<DrawCard>) | undefined;
        build(new TriggerBuilder<DrawCard>({
            when: (when) => {
                const draft = createDraft(title, holdsTriggerEvent(when, () => false));
                properties = () => toTriggerProps<DrawCard>(draft, when);
                return draft;
            },
            aggregateWhen: (aggregateWhen) => {
                const draft = createDraft(title, holdsAggregateEvents(() => false));
                properties = () => toAggregateProps<DrawCard>(draft, aggregateWhen);
                return draft;
            }
        }));
        if(!properties) {
            throw new Error(`${title}: a gained trigger starts with when() or aggregateWhen()`);
        }
        const props = properties();
        rejectPlayCondition(props);
        return EffectBuilder.card.static(EffectName.GainAbility, new GainAbility(abilityType, props));
    };
}

/** Grants a triggered ability written with the builder, like the card's own: `reaction(title, (ability) => ability.when({ … })…)`. */
gainAbility.reaction = gainedTrigger(AbilityType.Reaction);
gainAbility.interrupt = gainedTrigger(AbilityType.Interrupt);
gainAbility.wouldInterrupt = gainedTrigger(AbilityType.WouldInterrupt);
gainAbility.forcedReaction = gainedTrigger(AbilityType.ForcedReaction);
gainAbility.forcedInterrupt = gainedTrigger(AbilityType.ForcedInterrupt);
