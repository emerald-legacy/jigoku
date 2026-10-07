import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { GameObject } from '../GameObject.js';
import { GameAction, type GameActionProperties, targetList } from './GameAction.js';
import { RemoveFateAction } from './RemoveFateAction.js';
import { CardType, Location, type EventName } from '../Constants.js';
import { DiscardFromPlayAction } from './DiscardFromPlayAction.js';
import DrawCard from '../DrawCard.js';
import type BaseCard from '../BaseCard.js';

export interface InjureActionProperties extends GameActionProperties {
    target?: BaseCard | BaseCard[];
}

export class InjureAction<C extends AbilityContext = AbilityContext> extends GameAction<InjureActionProperties, EventName, C> {
    name = 'injure';
    targetType = [CardType.Character];
    effect = 'injure {0}';
    removeFateGameAction: GameAction;
    discardGameAction: GameAction;

    constructor(propertyFactory: InjureActionProperties | ((context: C) => InjureActionProperties)) {
        super(propertyFactory);
        this.removeFateGameAction = new RemoveFateAction({ amount: 1 });
        this.discardGameAction = new DiscardFromPlayAction({});
    }

    defaultTargets(context: C): GameObject[] {
        return [context.source];
    }

    getProperties(context: C, additionalProperties = {}) {
        const properties = super.getProperties(context, additionalProperties);
        this.removeFateGameAction.setDefaultTarget(() => properties.target);
        this.discardGameAction.setDefaultTarget(() => properties.target);
        return properties;
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
        const properties = this.getProperties(context, additionalProperties);
        for(const target of targetList(properties.target)) {
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
