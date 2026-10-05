import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CardType, EventName, Location } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type { CardActionProperties } from './CardGameAction.js';
import { LeavesPlayAction, type LeavesPlayEvent } from './LeavesPlayAction.js';
import { targetList, type ActionEvent } from './GameAction.js';

export interface ReturnToDeckProperties extends CardActionProperties {
    bottom?: boolean;
    shuffle?: boolean;
    location?: Location | Location[];
}

export class ReturnToDeckAction<C extends AbilityContext = AbilityContext> extends LeavesPlayAction<ReturnToDeckProperties, C, 'bottom' | 'shuffle' | 'location'> {
    name = 'returnToDeck';
    targetType = [CardType.Character, CardType.Attachment, CardType.Event, CardType.Holding];
    defaultProperties = {
        bottom: false,
        shuffle: false,
        location: Location.PlayArea
    };

    getCostMessage(context: C): MessageArgs {
        const properties = this.getProperties(context);
        return [
            properties.shuffle
                ? 'shuffling {0} into their deck'
                : 'returning {0} to the ' + (properties.bottom ? 'bottom' : 'top') + ' of their deck',
            [properties.target]
        ];
    }

    protected effectMessage(context: C): MessageArgs {
        const properties = this.getProperties(context);
        if(properties.shuffle) {
            return ['shuffle {0} into its owner\'s deck', []];
        }
        return ['return {0} to the ' + (properties.bottom ? 'bottom' : 'top') + ' of its owner\'s deck', []];
    }

    canAffect(card: DrawCard, context: C, additionalProperties = {}): boolean {
        const properties = this.getProperties(context);
        let location: Location[] = Array.isArray(properties.location) ? [...properties.location] : [properties.location];
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
        super.updateEvent(event, card, context, additionalProperties);
        event.destination = card.isDynasty ? Location.DynastyDeck : Location.ConflictDeck;
        event.options = { bottom };
        const targets = targetList(target);
        if(shuffle && (targets.length === 0 || card === targets[targets.length - 1])) {
            event.shuffle = true;
        }
    }

    eventHandler(event: LeavesPlayEvent<C>, additionalProperties: Record<string, unknown> = {}): void {
        super.eventHandler(event, additionalProperties);
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
