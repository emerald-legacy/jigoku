import { Blocker, Stage } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type { CardAbility } from '../../CardAbility.js';
import type BaseCard from '../../BaseCard.js';
import type { Event } from '../../Events/Event.js';
import type Player from '../../Player.js';

/** An ability that triggerAbility or resolveAbility resolves. */
interface AbilityToResolve {
    ability: CardAbility;
    subResolution?: boolean;
    player?: Player;
    event?: Event;
    /** The ability resolves "as if the conflict were at" this province (Keeper of Secret Names). */
    asIfConflictAt?: BaseCard;
}

export function abilityContext(properties: AbilityToResolve, context: AbilityContext) {
    const ability = properties.ability;
    const player = properties.player || context.player;
    const newContext = ability.isTriggeredAbilityInstance() ? ability.createContext(player, properties.event) : ability.createContext(player);
    newContext.asIfConflictAt = properties.asIfConflictAt;
    return newContext;
}

/** The context to resolve the ability in: a sub-resolution continues the triggering context. */
export function getResolutionContext(properties: AbilityToResolve, context: AbilityContext) {
    const newContext = abilityContext(properties, context);
    newContext.subResolution = !!properties.subResolution;
    if(properties.subResolution) {
        newContext.originatingContext = context.triggeringContext;
    }
    return newContext;
}

export function canResolveAbility(properties: AbilityToResolve, context: AbilityContext, ignoredBlockers: Blocker[]): boolean {
    const ability = properties.ability;
    const player = properties.player || context.player;
    if(!ability || (!properties.subResolution && player.isAbilityAtMax(ability.maxIdentifier))) {
        return false;
    }
    // a sub-resolution doesn't count toward the ability's max, nor is it stopped by it
    const ignored = properties.subResolution ? ignoredBlockers.concat(Blocker.MaxReached) : ignoredBlockers;
    const resolutionContext = abilityContext(properties, context);
    if(ability.meetsRequirements(resolutionContext, ignored.concat(Blocker.CannotPayCost)) !== Blocker.None) {
        return false;
    }
    // resolving pays neither the costs to play nor to trigger (RRG Resolve an Ability), only the ability's own
    const costContext = resolutionContext.copy({ stage: Stage.Cost });
    return ignored.includes(Blocker.CannotPayCost) ||
        ability.getCosts(resolutionContext, false, false).every((cost) => cost.canPay(costContext));
}
