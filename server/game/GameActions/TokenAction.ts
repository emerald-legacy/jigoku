import type { AbilityContext } from '../AbilityContext.js';
import { GameAction, type GameActionProperties, type ActionEvent } from './GameAction.js';
import type { StatusToken } from '../StatusToken.js';
import type { EventName } from '../Constants.js';

import type { Event } from '../Events/Event.js';
export interface TokenActionProperties extends GameActionProperties {
    target?: StatusToken | StatusToken[];
}

export class TokenAction<P extends TokenActionProperties = TokenActionProperties, N extends EventName = EventName, C extends AbilityContext = AbilityContext> extends GameAction<P, N, C> {
    targetType = ['token'];

    defaultTargets(context: C): StatusToken[] {
        return context.source.statusTokens ? [...context.source.statusTokens] : [];
    }

    canAffect(target: StatusToken, context: C, _additionalProperties = {}): boolean {
        if(Array.isArray(target)) {
            return target.length > 0 && target.every((a) => a.type === 'token');
        }
        return target.type === 'token';
    }

    checkEventCondition(event: ActionEvent<N, C>, additionalProperties = {}): boolean {
        return this.canAffect((event as { token?: StatusToken | StatusToken[] }).token as StatusToken, event.context, additionalProperties);
    }

    addPropertiesToEvent(event: ActionEvent<N, C>, token: StatusToken, context: C, additionalProperties: Record<string, unknown> = {}): void {
        super.addPropertiesToEvent(event, token, context, additionalProperties);
        const typedEvent = event as Event & { token: StatusToken | StatusToken[] };
        typedEvent.token = token;
        if(Array.isArray(typedEvent.token)) {
            typedEvent.token = [...typedEvent.token];
        }
    }
}
