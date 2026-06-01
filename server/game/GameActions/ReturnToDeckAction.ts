import type { AbilityContext } from '../AbilityContext.js';
import { CardTypes, EventNames, Locations } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

export interface ReturnToDeckProperties extends CardActionProperties {
    bottom?: boolean;
    shuffle?: boolean;
    location?: Locations | Locations[];
}

export class ReturnToDeckAction extends CardGameAction {
    name = 'returnToDeck';
    eventName = EventNames.OnCardLeavesPlay;
    targetType = [CardTypes.Character, CardTypes.Attachment, CardTypes.Event, CardTypes.Holding];
    defaultProperties: ReturnToDeckProperties = {
        bottom: false,
        shuffle: false,
        location: Locations.PlayArea
    };
    constructor(properties: ((context: AbilityContext) => ReturnToDeckProperties) | ReturnToDeckProperties) {
        super(properties);
    }

    getCostMessage(context: AbilityContext): [string, unknown[]] {
        let properties = this.getProperties(context) as ReturnToDeckProperties;
        return [
            properties.shuffle
                ? 'shuffling {0} into their deck'
                : 'returning {0} to the ' + (properties.bottom ? 'bottom' : 'top') + ' of their deck',
            [properties.target]
        ];
    }

    getEffectMessage(context: AbilityContext): [string, unknown[]] {
        let properties = this.getProperties(context) as ReturnToDeckProperties;
        if(properties.shuffle) {
            return ['shuffle {0} into its owner\'s deck', [properties.target]];
        }
        return [
            'return {0} to the ' + (properties.bottom ? 'bottom' : 'top') + ' of its owner\'s deck',
            [properties.target]
        ];
    }

    canAffect(card: DrawCard, context: AbilityContext, additionalProperties = {}): boolean {
        const properties = this.getProperties(context) as ReturnToDeckProperties;
        const rawLocation = properties.location ?? Locations.PlayArea;
        let location: Locations[] = Array.isArray(rawLocation) ? [...rawLocation] : [rawLocation];
        const index = location.indexOf(Locations.Provinces);
        if(index > -1) {
            location.splice(index, 1);
            location = location.concat(context.game.getProvinceArray());
        }

        return (
            (location.includes(Locations.Any) || location.includes(card.location)) &&
            super.canAffect(card, context, additionalProperties)
        );
    }

    updateEvent(event: GameEvent<EventNames.OnCardLeavesPlay>, card: DrawCard, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        const { shuffle, target, bottom } = this.getProperties(context, additionalProperties) as ReturnToDeckProperties;
        this.updateLeavesPlayEvent(event, card, context, additionalProperties);
        event.destination = card.isDynasty ? Locations.DynastyDeck : Locations.ConflictDeck;
        event.options = { bottom };
        const targets = target as DrawCard | DrawCard[] | undefined;
        const lastTarget = Array.isArray(targets) ? targets[targets.length - 1] : targets;
        if(shuffle && (!targets || (Array.isArray(targets) && targets.length === 0) || card === lastTarget)) {
            event.shuffle = true;
        }
    }

    eventHandler(event: GameEvent<EventNames.OnCardLeavesPlay>, additionalProperties: Record<string, unknown> = {}): void {
        this.leavesPlayEventHandler(event, additionalProperties);
        const card = event.card as DrawCard;
        if(event.shuffle) {
            if(event.destination === Locations.DynastyDeck) {
                card.owner.shuffleDynastyDeck();
            } else if(event.destination === Locations.ConflictDeck) {
                card.owner.shuffleConflictDeck();
            }
        }
    }
}
