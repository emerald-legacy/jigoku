import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { Players, type EventName } from '../Constants.js';
import type { Event } from '../Events/Event.js';
import type Player from '../Player.js';
import type { StatusToken } from '../StatusToken.js';
import type { GameAction } from './GameAction.js';
import { TokenAction, type TokenActionProperties } from './TokenAction.js';
import type { EffectArg } from '../Interfaces.js';

export interface SelectTokenProperties extends TokenActionProperties {
    activePromptTitle?: string;
    card?: BaseCard;
    player?: Players.Self | Players.Opponent;
    targets?: boolean;
    singleToken?: boolean;
    tokenCondition?: (token: StatusToken, context: AbilityContext) => boolean;
    cancelHandler?: () => void;
    subActionProperties?: (tokens: StatusToken | StatusToken[]) => Record<string, unknown>;
    message?: string;
    messageArgs?: (tokens: StatusToken | StatusToken[], player: Player) => MsgArg[];
    gameAction: GameAction;
    effect?: string;
    effectArgs?: (context: AbilityContext) => EffectArg[];
}

export class SelectTokenAction<C extends AbilityContext = AbilityContext> extends TokenAction<
    SelectTokenProperties,
    EventName,
    C,
    'activePromptTitle' | 'tokenCondition' | 'singleToken' | 'subActionProperties'
> {
    name = 'selectToken';
    defaultProperties = {
        activePromptTitle: 'Which token do you wish to select?',
        tokenCondition: () => true,
        singleToken: true,
        subActionProperties: (tokens: StatusToken | StatusToken[]) => ({ target: tokens })
    };

    /** A custom `effect` brings its own arguments, from `{0}` on. */
    getEffectMessage(context: C, additionalProperties: ActionOverrides = {}): MessageArgs {
        const { effect, effectArgs } = this.getProperties(context);
        if(effect) {
            return [effect, (effectArgs && effectArgs(context)) || []];
        }
        return super.getEffectMessage(context, additionalProperties);
    }

    protected effectMessage(): MessageArgs {
        return ['choose a status token for {0}', []];
    }

    private resolveProperties(context: C, additionalProperties: ActionOverrides = {}) {
        const properties = super.getProperties(context, additionalProperties);
        const { card } = properties;
        return card ? Object.assign(properties, { card }) : null;
    }

    canAffect(token: StatusToken, context: C, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.resolveProperties(context, additionalProperties);
        if(!properties) {
            return false;
        }
        if(properties.player === Players.Opponent && !context.player.opponent) {
            return false;
        }
        return (
            super.canAffect(token, context) &&
            properties.tokenCondition(token, context) &&
            properties.gameAction.hasLegalTarget(
                context,
                Object.assign({}, additionalProperties, properties.subActionProperties(token))
            )
        );
    }

    hasLegalTarget(context: C, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.resolveProperties(context, additionalProperties);
        if(!properties) {
            return false;
        }
        return properties.card.statusTokens.some((token) => this.canAffect(token, context, additionalProperties));
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        const properties = this.resolveProperties(context, additionalProperties);
        if(!properties) {
            return;
        }
        if(properties.player === Players.Opponent && !context.player.opponent) {
            return;
        } else if(!properties.card.statusTokens.some((token) => properties.tokenCondition(token, context))) {
            return;
        } else if(!this.hasLegalTarget(context, additionalProperties)) {
            return;
        }
        const opponent = context.player.opponent;
        let player: Player = properties.player === Players.Opponent && opponent ? opponent : context.player;
        if(properties.targets && context.choosingPlayerOverride) {
            player = context.choosingPlayerOverride;
        }
        const validTokens = properties.card.statusTokens.filter((token) =>
            properties.gameAction.canAffect(token, context)
        );
        const messageArgs = properties.messageArgs;
        if(properties.singleToken && validTokens.length > 1) {
            context.game.promptWithHandlerMenu(player, {
                activePromptTitle: properties.activePromptTitle,
                options: validTokens.map((token) => ({
                    text: token.name,
                    handler: () => {
                        if(properties.message && messageArgs) {
                            context.game.addMessage(properties.message, ...messageArgs(token, player));
                        }
                        context.tokens[this.name] = [token];
                        properties.gameAction.addEventsToArray(
                            events,
                            context,
                            Object.assign({}, additionalProperties, properties.subActionProperties(token))
                        );
                    }
                })),
                context: context
            });
        } else {
            context.tokens[this.name] = validTokens;
            if(properties.message && messageArgs) {
                context.game.addMessage(properties.message, ...messageArgs(validTokens, player));
            }
            properties.gameAction.addEventsToArray(
                events,
                context,
                Object.assign({}, additionalProperties, properties.subActionProperties(validTokens))
            );
        }
    }

    hasTargetsChosenByInitiatingPlayer(context: C, additionalProperties: ActionOverrides = {}): boolean {
        const properties = super.getProperties(context, additionalProperties);
        return !!properties.targets && properties.player !== Players.Opponent;
    }
}
