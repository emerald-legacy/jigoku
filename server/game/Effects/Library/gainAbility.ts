import { AbilityType, EffectName, type Location } from '../../Constants.js';
import type {
    ActionProps,
    PersistentEffectProps,
    TargetLocation,
    TriggeredAbilityProps,
    TriggeredAbilityWhenProps,
    WhenType
} from '../../Interfaces.js';
import { AbilityBuilder, createDraft, holdsTriggerEvent, toActionProps, toTriggerProps, type ActionContext, type TriggerBase } from '../../AbilityBuilder.js';
import { CardAction } from '../../CardAction.js';
import type BaseCard from '../../BaseCard.js';
import type { CardAbility } from '../../CardAbility.js';
import type DrawCard from '../../DrawCard.js';
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

/** Grants an action written with the builder; `context.source` is the card that gains it. */
gainAbility.action = function(title: string, build: (ability: AbilityBuilder<ActionContext<DrawCard>>) => unknown): Res {
    const draft = createDraft(title, (context) => context.ability instanceof CardAction);
    build(new AbilityBuilder<ActionContext<DrawCard>>(draft));
    return gainAbility(AbilityType.Action, toActionProps<DrawCard>(draft));
};

function gainedTrigger(abilityType: AbilityType.Reaction | AbilityType.Interrupt | AbilityType.WouldInterrupt | AbilityType.ForcedReaction | AbilityType.ForcedInterrupt) {
    return <W extends WhenType<DrawCard>>(title: string, when: W, build: (ability: AbilityBuilder<TriggerBase<DrawCard, W, false>>) => unknown): Res => {
        const draft = createDraft(title, holdsTriggerEvent(when, () => false));
        build(new AbilityBuilder<TriggerBase<DrawCard, W, false>>(draft));
        return EffectBuilder.card.static(EffectName.GainAbility, new GainAbility(abilityType, toTriggerProps<DrawCard>(draft, when)));
    };
}

/** Grants a triggered ability written with the builder, like the card's own `reaction(title).when(when)`. */
gainAbility.reaction = gainedTrigger(AbilityType.Reaction);
gainAbility.interrupt = gainedTrigger(AbilityType.Interrupt);
gainAbility.wouldInterrupt = gainedTrigger(AbilityType.WouldInterrupt);
gainAbility.forcedReaction = gainedTrigger(AbilityType.ForcedReaction);
gainAbility.forcedInterrupt = gainedTrigger(AbilityType.ForcedInterrupt);
