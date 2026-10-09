import type { ActionOverrides } from './GameAction.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { GameObject } from '../GameObject.js';
import { GameAction, type GameActionProperties, targetList } from './GameAction.js';
import { RemoveFateAction } from './RemoveFateAction.js';
import { CardType, Location, type EventName } from '../Constants.js';
import { DiscardFromPlayAction } from './DiscardFromPlayAction.js';
import DrawCard from '../DrawCard.js';
import type BaseCard from '../BaseCard.js';

export interface InjureProperties extends GameActionProperties {
    target?: BaseCard | BaseCard[];
}

export class InjureAction<C extends AbilityContext = AbilityContext> extends GameAction<InjureProperties, EventName, C> {
    name = 'injure';
    targetType = [CardType.Character];
    effect = 'injure {0}';
    removeFateGameAction: GameAction;
    discardGameAction: GameAction;

    constructor(propertyFactory: InjureProperties | ((context: C) => InjureProperties)) {
        super(propertyFactory);
        this.removeFateGameAction = new RemoveFateAction({ amount: 1 });
        this.discardGameAction = new DiscardFromPlayAction({});
    }

    defaultTargets(context: C): GameObject[] {
        return [context.source];
    }

    canAffect(target: GameObject, context: C, additionalProperties: ActionOverrides = {}): boolean {
        if(!(target instanceof DrawCard)) {
            return false;
        }

        if(target.location !== Location.PlayArea) {
            return false;
        }

        const overrides = { ...additionalProperties, target: this.getProperties(context, additionalProperties).target };
        if(target.getFate() === 0) {
            return this.discardGameAction.canAffect(target, context, overrides);
        }
        return this.removeFateGameAction.canAffect(target, context, overrides);
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        const overrides = { ...additionalProperties, target: properties.target };
        for(const target of targetList(properties.target)) {
            if(target.getFate() === 0) {
                if(this.discardGameAction.canAffect(target, context, overrides)) {
                    events.push(this.discardGameAction.getEvent(target, context, overrides));
                }
            } else {
                if(this.removeFateGameAction.canAffect(target, context, overrides)) {
                    events.push(this.removeFateGameAction.getEvent(target, context, overrides));
                }
            }
        }
    }
}
