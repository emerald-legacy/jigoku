import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CardType, EventName, Location } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type { CardActionProperties } from './CardGameAction.js';
import { LeavesPlayAction, type LeavesPlayEvent } from './LeavesPlayAction.js';
import type { ActionEvent } from './GameAction.js';

export interface ReturnToDeckProperties extends CardActionProperties {
    bottom?: boolean;
    shuffle?: boolean;
    location?: Location | Location[];
}

export class ReturnToDeckAction<C extends AbilityContext = AbilityContext> extends LeavesPlayAction<ReturnToDeckProperties, C> {
    name = 'returnToDeck';
    eventName = EventName.OnCardLeavesPlay;
    targetType = [CardType.Character, CardType.Attachment, CardType.Event, CardType.Holding];
    defaultProperties: ReturnToDeckProperties = {
        bottom: false,
        shuffle: false,
        location: Location.PlayArea
    };
    constructor(properties: ((context: C) => ReturnToDeckProperties) | ReturnToDeckProperties) {
        super(properties);
    }

    getCostMessage(context: C): MessageArgs {
        let properties = this.getProperties(context);
        return [
            properties.shuffle
                ? 'shuffling {0} into their deck'
                : 'returning {0} to the ' + (properties.bottom ? 'bottom' : 'top') + ' of their deck',
            [properties.target]
        ];
    }

    getEffectMessage(context: C): MessageArgs {
        let properties = this.getProperties(context);
        if(properties.shuffle) {
            return ['shuffle {0} into its owner\'s deck', [properties.target]];
        }
        return [
            'return {0} to the ' + (properties.bottom ? 'bottom' : 'top') + ' of its owner\'s deck',
            [properties.target]
        ];
    }

    canAffect(card: DrawCard, context: C, additionalProperties = {}): boolean {
        const properties = this.getProperties(context);
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

    updateEvent(event: ActionEvent<EventName.OnCardLeavesPlay, C>, card: DrawCard, context: C, additionalProperties: Record<string, unknown> = {}): void {
        const { shuffle, target, bottom } = this.getProperties(context, additionalProperties);
        this.updateLeavesPlayEvent(event, card, context, additionalProperties);
        event.destination = card.isDynasty ? Location.DynastyDeck : Location.ConflictDeck;
        event.options = { bottom };
        const targets = target;
        const lastTarget = Array.isArray(targets) ? targets[targets.length - 1] : targets;
        if(shuffle && (!targets || (Array.isArray(targets) && targets.length === 0) || card === lastTarget)) {
            event.shuffle = true;
        }
    }

    eventHandler(event: LeavesPlayEvent<C>, additionalProperties: Record<string, unknown> = {}): void {
        this.leavesPlayEventHandler(event, additionalProperties);
        const card = event.card;
        if(event.shuffle) {
            if(event.destination === Location.DynastyDeck) {
                card.owner.shuffleDynastyDeck();
            } else if(event.destination === Location.ConflictDeck) {
                card.owner.shuffleConflictDeck();
            }
        }
    }
}
