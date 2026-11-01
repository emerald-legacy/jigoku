import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CardType, type EventName, Location, RestrictionType } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type { CardActionProperties } from './CardGameAction.js';
import { LeavesPlayAction, type LeavesPlayEvent } from './LeavesPlayAction.js';
import { targetList, type ActionEvent } from './GameAction.js';

export interface ReturnToDeckProperties extends CardActionProperties {
    bottom?: boolean;
    shuffle?: boolean;
    location?: Location | Location[];
}

export class ReturnToDeckAction<Context extends AbilityContext = AbilityContext> extends LeavesPlayAction<ReturnToDeckProperties, Context, 'bottom' | 'shuffle' | 'location'> {
    override name = 'returnToDeck';
    override restriction = RestrictionType.ReturnToDeck;
    override targetType = [CardType.Character, CardType.Attachment, CardType.Event, CardType.Holding];
    override defaultProperties = {
        bottom: false,
        shuffle: false,
        location: Location.PlayArea
    };

    override getCostMessage(context: Context): MessageArgs {
        const properties = this.getProperties(context);
        return [
            properties.shuffle
                ? 'shuffling {0} into their deck'
                : 'returning {0} to the ' + (properties.bottom ? 'bottom' : 'top') + ' of their deck',
            [properties.target]
        ];
    }

    protected override effectMessage(context: Context, additionalProperties: ActionOverrides = {}): MessageArgs {
        const properties = this.getProperties(context, additionalProperties);
        if(properties.shuffle) {
            return ['shuffle {0} into its owner\'s deck', []];
        }
        return ['return {0} to the ' + (properties.bottom ? 'bottom' : 'top') + ' of its owner\'s deck', []];
    }

    override canAffect(card: DrawCard, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
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

    override updateEvent(event: ActionEvent<EventName.OnCardLeavesPlay, Context>, card: DrawCard, context: Context, additionalProperties: ActionOverrides = {}): void {
        const { shuffle, target, bottom } = this.getProperties(context, additionalProperties);
        super.updateEvent(event, card, context, additionalProperties);
        event.destination = card.isDynasty ? Location.DynastyDeck : Location.ConflictDeck;
        event.options = { bottom };
        const targets = targetList(target);
        if(shuffle && (targets.length === 0 || card === targets[targets.length - 1])) {
            event.shuffle = true;
        }
    }

    override eventHandler(event: LeavesPlayEvent<Context>, additionalProperties: ActionOverrides = {}): void {
        super.eventHandler(event, additionalProperties);
        const card = event.card;
        if(event.shuffle) {
            card.owner.shuffleDeck(event.destination);
        }
    }
}
