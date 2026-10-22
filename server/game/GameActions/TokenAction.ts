import type { ActionOverrides } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import { GameAction, type GameActionProperties, type ActionEvent } from './GameAction.js';
import type { StatusToken } from '../StatusToken.js';
import type { EventName } from '../Constants.js';

export interface TokenActionProperties extends GameActionProperties {
    target?: StatusToken | StatusToken[];
}

type TokenEvent<EventType extends EventName, Context extends AbilityContext> = ActionEvent<EventType, Context> & { token: StatusToken };

export class TokenAction<
    Properties extends TokenActionProperties = TokenActionProperties,
    EventType extends EventName = EventName,
    Context extends AbilityContext = AbilityContext,
    Defaulted extends keyof Properties = never
> extends GameAction<Properties, EventType, Context, Defaulted> {
    override targetType = ['token'];

    override defaultTargets(context: Context): StatusToken[] {
        return context.source.statusTokens ? [...context.source.statusTokens] : [];
    }

    override canAffect(target: StatusToken, _context: Context, _additionalProperties = {}): boolean {
        return target.type === 'token';
    }

    override checkEventCondition(event: TokenEvent<EventType, Context>, additionalProperties: ActionOverrides = {}): boolean {
        return this.canAffect(event.token, event.context, additionalProperties);
    }

    override addPropertiesToEvent(event: TokenEvent<EventType, Context>, token: StatusToken, context: Context, additionalProperties: ActionOverrides = {}): void {
        super.addPropertiesToEvent(event, token, context, additionalProperties);
        event.token = token;
    }
}
