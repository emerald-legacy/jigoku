import type { AbilityContext } from '../AbilityContext.js';
import { GameAction, type GameActionProperties, type ActionEvent } from './GameAction.js';
import type { StatusToken } from '../StatusToken.js';
import type { EventName } from '../Constants.js';

export interface TokenActionProperties extends GameActionProperties {
    target?: StatusToken | StatusToken[];
}

export type TokenEvent<N extends EventName, C extends AbilityContext> = ActionEvent<N, C> & { token: StatusToken };

export class TokenAction<P extends TokenActionProperties = TokenActionProperties, N extends EventName = EventName, C extends AbilityContext = AbilityContext> extends GameAction<P, N, C> {
    targetType = ['token'];

    defaultTargets(context: C): StatusToken[] {
        return context.source.statusTokens ? [...context.source.statusTokens] : [];
    }

    canAffect(target: StatusToken, context: C, _additionalProperties = {}): boolean {
        return target.type === 'token';
    }

    checkEventCondition(event: TokenEvent<N, C>, additionalProperties = {}): boolean {
        return this.canAffect(event.token, event.context, additionalProperties);
    }

    addPropertiesToEvent(event: TokenEvent<N, C>, token: StatusToken, context: C, additionalProperties: Record<string, unknown> = {}): void {
        super.addPropertiesToEvent(event, token, context, additionalProperties);
        event.token = token;
    }
}
