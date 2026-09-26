import { AbilityType } from '../Constants.js';
import type { Event } from '../Events/Event.js';
import type { AnyEvent } from '../TriggeredAbilityContext.js';

// The payload fields each title reads; the event name guarantees them.
const EventToTitleFunc: Record<string, (event: AnyEvent) => string> = {
    onCardBowed(event) {
        return `${event.card?.name} being bowed`;
    },
    onCardDishonored(event) {
        return `${event.card?.name} being dishonored`;
    },
    onCardHonored(event) {
        return `${event.card?.name} being honored`;
    },
    onCardLeavesPlay(event) {
        return `${event.card?.name} leaving play`;
    },
    onCardPlayed(event) {
        return `${event.card?.name} being played`;
    },
    onCharacterEntersPlay(event) {
        return `${event.card?.name} entering play`;
    },
    onClaimRing(event) {
        return `to the ${event.ring?.element} ring being claimed`;
    },
    onInitiateAbilityEffects(event) {
        return `the effects of ${event.card?.name}`;
    },
    onMoveFate(event) {
        return `Fate being moved from ${event.origin ? event.origin.name : event.card ? event.card.name : 'somewhere'}`;
    },
    onPhaseEnded(event) {
        return `${event.phase} phase ending`;
    },
    onPhaseStarted(event) {
        return `${event.phase} phase starting`;
    },
    onReturnRing(event) {
        return `returning the ${event.ring?.element} ring`;
    }
};

const AbilityTypeToWord = new Map([
    ['cancelinterrupt', 'interrupt'],
    ['interrupt', 'interrupt'],
    ['reaction', 'reaction'],
    ['forcedreaction', 'forced reaction'],
    ['forcedinterrupt', 'forced interrupt'],
    ['duelreaction', 'reaction']
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
    getTitle(abilityType: string, eventsaa: Event[] | Event) {
        const events = Array.isArray(eventsaa) ? eventsaa : [eventsaa];
        const abilityWord = AbilityTypeToWord.get(abilityType) ?? abilityType;
        const titles: string[] = events
            .map((event) => {
                let func = EventToTitleFunc[event.name];
                if(func) {
                    return func(event);
                }
                return '';
            })
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
    getAction(event: Event) {
        let func = EventToTitleFunc[event.name];
        if(func) {
            return func(event);
        }
        return event.name;
    }
};
