import type { MessageArgs } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { GameObject } from '../GameObject.js';
import { GameAction, GameActionProperties } from './GameAction.js';
import { RemoveFateAction } from './RemoveFateAction.js';
import { CardType, Location, type EventName } from '../Constants.js';
import { DiscardFromPlayAction } from './DiscardFromPlayAction.js';
import DrawCard from '../DrawCard.js';
import BaseCard from '../BaseCard.js';

export interface InjureActionProperties extends GameActionProperties {
    target?: BaseCard | BaseCard[];
}

export class InjureAction<C extends AbilityContext = AbilityContext> extends GameAction<InjureActionProperties, EventName, C> {
    name = 'injure';
    targetType = [CardType.Character];
    removeFateGameAction: GameAction;
    discardGameAction: GameAction;

    constructor(propertyFactory: InjureActionProperties | ((context: C) => InjureActionProperties)) {
        super(propertyFactory);
        this.removeFateGameAction = new RemoveFateAction({ amount: 1 });
        this.discardGameAction = new DiscardFromPlayAction({});
    }

    getProperties(context: C, additionalProperties = {}): InjureActionProperties {
        let properties = super.getProperties(context, additionalProperties);
        this.removeFateGameAction.setDefaultTarget(() => properties.target);
        this.discardGameAction.setDefaultTarget(() => properties.target);
        return properties;
    }

    getEffectMessage(context: C): MessageArgs {
        let properties = this.getProperties(context);
        return ['injure {0}', [properties.target]];
    }

    canAffect(target: GameObject, context: C, additionalProperties = {}): boolean {
        if(!(target instanceof DrawCard)) {
            return false;
        }

        if(target.location !== Location.PlayArea) {
            return false;
        }

        if(target.getFate() === 0) {
            return this.discardGameAction.canAffect(target, context, additionalProperties);
        }
        return this.removeFateGameAction.canAffect(target, context, additionalProperties);
    }

    addEventsToArray(events: Event[], context: C, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        for(let target of properties.target as DrawCard[]) {
            if(target.getFate() === 0) {
                if(this.discardGameAction.canAffect(target, context, additionalProperties)) {
                    events.push(this.discardGameAction.getEvent(target, context, additionalProperties));
                }
            } else {
                if(this.removeFateGameAction.canAffect(target, context, additionalProperties)) {
                    events.push(this.removeFateGameAction.getEvent(target, context, additionalProperties));
                }
            }
        }
    }
}
