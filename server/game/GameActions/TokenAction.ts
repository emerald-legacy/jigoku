import type { AbilityContext } from '../AbilityContext.js';
import { GameAction, type GameActionProperties } from './GameAction.js';
import type { StatusToken } from '../StatusToken.js';

import type { Event } from '../Events/Event.js';
export type TokenActionProperties = GameActionProperties;

export class TokenAction<P extends TokenActionProperties = TokenActionProperties> extends GameAction<P> {
    targetType = ['token'];

    defaultTargets(context: AbilityContext): StatusToken[] {
        return context.source.statusTokens ? [...context.source.statusTokens] : [];
    }

    canAffect(target: StatusToken, context: AbilityContext, _additionalProperties = {}): boolean {
        if(Array.isArray(target)) {
            return target.length > 0 && target.every((a) => a.type === 'token');
        }
        return target.type === 'token';
    }

    checkEventCondition(event: Event, additionalProperties = {}): boolean {
        return this.canAffect(event.token as StatusToken, (event.context as AbilityContext), additionalProperties);
    }

    addPropertiesToEvent(event: Event, token: StatusToken, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        super.addPropertiesToEvent(event, token, context, additionalProperties);
        const typedEvent = event as Event & { token: StatusToken | StatusToken[] };
        typedEvent.token = token;
        if(Array.isArray(typedEvent.token)) {
            typedEvent.token = [...typedEvent.token];
        }
    }
}
