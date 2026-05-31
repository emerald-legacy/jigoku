import { AbilityTypes } from '../Constants.js';
import type { Event } from '../Events/Event.js';

const EventToTitleFunc: Record<string, (event: Event) => string> = {
    onCardBowed(event: Event) {
        return `${event.card.name} being bowed`;
    },
    onCardDishonored(event: Event) {
        return `${event.card.name} being dishonored`;
    },
    onCardHonored(event: Event) {
        return `${event.card.name} being honored`;
    },
    onCardLeavesPlay(event: Event) {
        return `${event.card.name} leaving play`;
    },
    onCardPlayed(event: Event) {
        return `${event.card.name} being played`;
    },
    onCharacterEntersPlay(event: Event) {
        return `${event.card.name} entering play`;
    },
    onClaimRing(event: Event) {
        return `to the ${event.ring.element} ring being claimed`;
    },
    onInitiateAbilityEffects(event: Event) {
        return `the effects of ${event.card.name}`;
    },
    onMoveCharactersToConflict() {
        return 'characters moving to the conflict';
    },
    onMoveFate(event: Event) {
        return `Fate being moved from ${event.origin ? event.origin.name : event.card ? event.card.name : 'somewhere'}`;
    },
    onPhaseEnded(event: Event) {
        return `${event.phase} phase ending`;
    },
    onPhaseStarted(event: Event) {
        return `${event.phase} phase starting`;
    },
    onRemovedFromChallenge(event: Event) {
        return `${event.card.name} being removed from the challenge`;
    },
    onReturnRing(event: Event) {
        return `returning the ${event.ring.element} ring`;
    },
    onSacrificed(event: Event) {
        return `${event.card.name} being sacrificed`;
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

        if(abilityType === AbilityTypes.ForcedReaction || abilityType === AbilityTypes.ForcedInterrupt) {
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
