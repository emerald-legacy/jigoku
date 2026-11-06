import { AbilityType, EventName } from '../Constants.js';
import type { Event } from '../Events/Event.js';

function eventTitle(event: Event): string | undefined {
    if(event.is(EventName.OnCardBowed)) {
        return `${event.card.name} being bowed`;
    } else if(event.is(EventName.OnCardDishonored)) {
        return `${event.card.name} being dishonored`;
    } else if(event.is(EventName.OnCardHonored)) {
        return `${event.card.name} being honored`;
    } else if(event.is(EventName.OnCardLeavesPlay)) {
        return `${event.card.name} leaving play`;
    } else if(event.is(EventName.OnCardPlayed)) {
        return `${event.card.name} being played`;
    } else if(event.is(EventName.OnCharacterEntersPlay)) {
        return `${event.card.name} entering play`;
    } else if(event.is(EventName.OnClaimRing)) {
        return `the ${event.ring.element} ring being claimed`;
    } else if(event.is(EventName.OnInitiateAbilityEffects)) {
        return `the effects of ${event.card.name}`;
    } else if(event.is(EventName.OnMoveFate)) {
        return `Fate being moved from ${event.origin ? event.origin.name : event.card ? event.card.name : 'somewhere'}`;
    } else if(event.is(EventName.OnPhaseEnded)) {
        return `${event.phase} phase ending`;
    } else if(event.is(EventName.OnPhaseStarted)) {
        return `${event.phase} phase starting`;
    } else if(event.is(EventName.OnReturnRing)) {
        return `returning the ${event.ring.element} ring`;
    }
    return undefined;
}

const AbilityTypeToWord = new Map<AbilityType, string>([
    [AbilityType.WouldInterrupt, 'interrupt'],
    [AbilityType.Interrupt, 'interrupt'],
    [AbilityType.Reaction, 'reaction'],
    [AbilityType.ForcedReaction, 'forced reaction'],
    [AbilityType.ForcedInterrupt, 'forced interrupt'],
    [AbilityType.DuelReaction, 'reaction']
]);

function FormatTitles(titles: string[]) {
    return titles.reduce((string, title, index) => {
        if(index === 0) {
            return title;
        } else if(index === 1) {
            return title + ' or ' + string;
        }
        return title + ', ' + string;
    }, '');
}

export const TriggeredAbilityWindowTitle = {
    getTitle(abilityType: AbilityType, events: Event[]) {
        const abilityWord = AbilityTypeToWord.get(abilityType) ?? abilityType;
        const titles: string[] = events
            .map((event) => eventTitle(event) ?? '')
            .filter(Boolean);

        if(abilityType === AbilityType.ForcedReaction || abilityType === AbilityType.ForcedInterrupt) {
            return titles.length > 0
                ? `Choose ${abilityWord} order for ${FormatTitles(titles)}`
                : `Choose ${abilityWord} order`;
        }

        if(titles.length > 0) {
            return `Any ${abilityWord}s to ${FormatTitles(titles)}?`;
        }

        return `Any ${abilityWord}s?`;
    },
    getAction(event: Event | Event[]) {
        // an aggregate trigger's events name no single action
        if(Array.isArray(event)) {
            return undefined;
        }
        return eventTitle(event) ?? event.name;
    }
};
