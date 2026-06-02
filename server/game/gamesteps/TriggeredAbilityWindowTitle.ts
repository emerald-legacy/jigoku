import { AbilityType, EventName } from '../Constants.js';
import type { Event } from '../Events/Event.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import type BaseCard from '../BaseCard.js';

const EventToTitleFunc: Record<string, (event: Event) => string> = {
    onCardBowed(event: Event) {
        return `${(event as GameEvent<EventName.OnCardBowed>).card.name} being bowed`;
    },
    onCardDishonored(event: Event) {
        return `${(event as GameEvent<EventName.OnCardDishonored>).card.name} being dishonored`;
    },
    onCardHonored(event: Event) {
        return `${(event as GameEvent<EventName.OnCardHonored>).card.name} being honored`;
    },
    onCardLeavesPlay(event: Event) {
        return `${(event as GameEvent<EventName.OnCardLeavesPlay>).card.name} leaving play`;
    },
    onCardPlayed(event: Event) {
        return `${(event as GameEvent<EventName.OnCardPlayed>).card.name} being played`;
    },
    onCharacterEntersPlay(event: Event) {
        return `${(event as GameEvent<EventName.OnCharacterEntersPlay>).card.name} entering play`;
    },
    onClaimRing(event: Event) {
        return `to the ${(event as GameEvent<EventName.OnClaimRing>).ring.element} ring being claimed`;
    },
    onInitiateAbilityEffects(event: Event) {
        return `the effects of ${(event as GameEvent<EventName.OnInitiateAbilityEffects>).card.name}`;
    },
    onMoveCharactersToConflict() {
        return 'characters moving to the conflict';
    },
    onMoveFate(event: Event) {
        const moveFate = event as GameEvent<EventName.OnMoveFate> & { card?: BaseCard };
        return `Fate being moved from ${moveFate.origin ? moveFate.origin.name : moveFate.card ? moveFate.card.name : 'somewhere'}`;
    },
    onPhaseEnded(event: Event) {
        return `${(event as GameEvent<EventName.OnPhaseEnded>).phase} phase ending`;
    },
    onPhaseStarted(event: Event) {
        return `${(event as GameEvent<EventName.OnPhaseStarted>).phase} phase starting`;
    },
    onRemovedFromChallenge(event: Event) {
        return `${(event as GameEvent<EventName.OnCardLeavesPlay>).card.name} being removed from the challenge`;
    },
    onReturnRing(event: Event) {
        return `returning the ${(event as GameEvent<EventName.OnReturnRing>).ring?.element} ring`;
    },
    onSacrificed(event: Event) {
        return `${(event as GameEvent<EventName.OnCardLeavesPlay>).card.name} being sacrificed`;
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
