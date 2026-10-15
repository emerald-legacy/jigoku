import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import { CompositeGameAction } from './CompositeGameAction.js';
import type { GameActionList } from './MultipleGameAction.js';
import type { GameAction, GameActionProperties } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';

export interface SequentialProperties extends GameActionProperties {
    gameActions: GameAction[];
}

export class SequentialAction<C extends AbilityContext = AbilityContext> extends CompositeGameAction<SequentialProperties, C> {
    constructor(gameActions: GameActionList<C>) {
        super(typeof gameActions === 'function' ? (context: C) => ({ gameActions: gameActions(context) }) : { gameActions });
    }

    override getEffectMessage(context: C, additionalProperties: ActionOverrides = {}): MessageArgs {
        const { properties, overrides } = this.getCompositeProperties(context, additionalProperties);
        return properties.gameActions[0].getEffectMessage(context, overrides);
    }

    protected children(properties: SequentialProperties) {
        return properties.gameActions;
    }

    override addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        const { properties, overrides } = this.getCompositeProperties(context, additionalProperties);
        for(const gameAction of properties.gameActions) {
            context.game.queueSimpleStep(() => {
                if(gameAction.hasLegalTarget(context, overrides)) {
                    const eventsForThisAction: Event[] = [];
                    gameAction.addEventsToArray(eventsForThisAction, context, overrides);
                    context.game.queueSimpleStep(() => {
                        for(const event of eventsForThisAction) {
                            events.push(event);
                        }
                        if(gameAction !== properties.gameActions[properties.gameActions.length - 1]) {
                            context.game.openThenEventWindow(eventsForThisAction);
                        }
                    });
                }
            });
        }
    }
}
