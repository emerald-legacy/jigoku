import type { AbilityContext } from '../AbilityContext.js';
import { CardType, EventName, Location } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

export interface ReturnToDeckProperties extends CardActionProperties {
    bottom?: boolean;
    shuffle?: boolean;
    location?: Location | Location[];
}

export class ReturnToDeckAction extends CardGameAction {
    name = 'returnToDeck';
    eventName = EventName.OnCardLeavesPlay;
    targetType = [CardType.Character, CardType.Attachment, CardType.Event, CardType.Holding];
    defaultProperties: ReturnToDeckProperties = {
        bottom: false,
        shuffle: false,
        location: Location.PlayArea
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
        const rawLocation = properties.location ?? Location.PlayArea;
        let location: Location[] = Array.isArray(rawLocation) ? [...rawLocation] : [rawLocation];
        const index = location.indexOf(Location.Provinces);
        if(index > -1) {
            location.splice(index, 1);
            location = location.concat(context.game.getProvinceArray());
        }

        return (
            (location.includes(Location.Any) || location.includes(card.location)) &&
            super.canAffect(card, context, additionalProperties)
        );
    }

    updateEvent(event: GameEvent<EventName.OnCardLeavesPlay>, card: DrawCard, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        const { shuffle, target, bottom } = this.getProperties(context, additionalProperties) as ReturnToDeckProperties;
        this.updateLeavesPlayEvent(event, card, context, additionalProperties);
        event.destination = card.isDynasty ? Location.DynastyDeck : Location.ConflictDeck;
        event.options = { bottom };
        const targets = target as DrawCard | DrawCard[] | undefined;
        const lastTarget = Array.isArray(targets) ? targets[targets.length - 1] : targets;
        if(shuffle && (!targets || (Array.isArray(targets) && targets.length === 0) || card === lastTarget)) {
            event.shuffle = true;
        }
    }

    eventHandler(event: GameEvent<EventName.OnCardLeavesPlay>, additionalProperties: Record<string, unknown> = {}): void {
        this.leavesPlayEventHandler(event, additionalProperties);
        const card = event.card as DrawCard;
        if(event.shuffle) {
            if(event.destination === Location.DynastyDeck) {
                card.owner.shuffleDynastyDeck();
            } else if(event.destination === Location.ConflictDeck) {
                card.owner.shuffleConflictDeck();
            }
        }
    }
}
