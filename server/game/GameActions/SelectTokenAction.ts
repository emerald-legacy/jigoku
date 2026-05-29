import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../basecard.js';
import { Players } from '../Constants.js';
import type { Event } from '../Events/Event.js';
import type Player from '../player.js';
import type { StatusToken } from '../StatusToken.js';
import type { GameAction } from './GameAction.js';
import { TokenAction, type TokenActionProperties } from './TokenAction.js';

export interface SelectTokenProperties extends TokenActionProperties {
    activePromptTitle?: string;
    card?: BaseCard;
    player?: Players.Self | Players.Opponent;
    targets?: boolean;
    singleToken?: boolean;
    tokenCondition?: (token: StatusToken, context: AbilityContext) => boolean;
    cancelHandler?: () => void;
    subActionProperties?: (token: any) => Record<string, unknown>;
    message?: string;
    messageArgs?: (token: any, player: Player) => unknown[];
    gameAction: GameAction;
    effect?: string;
    effectArgs?: (context: AbilityContext) => string[];
}

type ResolvedSelectTokenProperties = SelectTokenProperties & {
    tokenCondition: NonNullable<SelectTokenProperties['tokenCondition']>;
    subActionProperties: NonNullable<SelectTokenProperties['subActionProperties']>;
    card: BaseCard;
};

export class SelectTokenAction extends TokenAction {
    name = 'selectToken';
    defaultProperties: SelectTokenProperties = {
        activePromptTitle: 'Which token do you wish to select?',
        tokenCondition: () => true,
        singleToken: true,
        subActionProperties: (token) => ({ target: token }),
        gameAction: null as unknown as GameAction
    };

    constructor(properties: SelectTokenProperties | ((context: AbilityContext) => SelectTokenProperties)) {
        super(properties);
    }

    getEffectMessage(context: AbilityContext): [string, unknown[]] {
        let { target, effect, effectArgs } = this.getProperties(context) as SelectTokenProperties;
        if(effect) {
            return [effect, (effectArgs && effectArgs(context)) || []];
        }
        return ['choose a status token for {0}', [target]];
    }

    private resolveProperties(context: AbilityContext, additionalProperties = {}): ResolvedSelectTokenProperties | null {
        const properties = super.getProperties(context, additionalProperties) as SelectTokenProperties;
        if(!properties.card) {
            return null;
        }
        return Object.assign(properties, {
            tokenCondition: properties.tokenCondition ?? (() => true),
            subActionProperties: properties.subActionProperties ?? ((token: any) => ({ target: token })),
            card: properties.card
        });
    }

    canAffect(token: StatusToken, context: AbilityContext, additionalProperties = {}): boolean {
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

    hasLegalTarget(context: AbilityContext, additionalProperties = {}): boolean {
        const properties = this.resolveProperties(context, additionalProperties);
        if(!properties) {
            return false;
        }
        return properties.card.statusTokens.some((token: StatusToken) => this.canAffect(token, context, additionalProperties));
    }

    addEventsToArray(events: Event[], context: AbilityContext, additionalProperties = {}): void {
        const properties = this.resolveProperties(context, additionalProperties);
        if(!properties) {
            return;
        }
        if(properties.player === Players.Opponent && !context.player.opponent) {
            return;
        } else if(!properties.card.statusTokens.some((token: StatusToken) => properties.tokenCondition(token, context))) {
            return;
        } else if(!this.hasLegalTarget(context, additionalProperties)) {
            return;
        }
        let player: Player = (properties.player === Players.Opponent ? context.player.opponent : context.player) as Player;
        if(properties.targets && context.choosingPlayerOverride) {
            player = context.choosingPlayerOverride as Player;
        }
        const validTokens = properties.card.statusTokens.filter((token: StatusToken) =>
            properties.gameAction.canAffect(token, context)
        );
        const messageArgs = properties.messageArgs;
        if(properties.singleToken && validTokens.length > 1) {
            const choices = validTokens.map((token: StatusToken) => token.name);
            const handlers = validTokens.map((token: StatusToken) => {
                return () => {
                    if(properties.message && messageArgs) {
                        context.game.addMessage(properties.message, ...messageArgs(token, player));
                    }
                    context.tokens[this.name] = token;
                    properties.gameAction.addEventsToArray(
                        events,
                        context,
                        Object.assign({}, additionalProperties, properties.subActionProperties(token))
                    );
                };
            });
            context.game.promptWithHandlerMenu(player, {
                activePromptTitle: properties.activePromptTitle,
                choices: choices,
                handlers: handlers,
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

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext, additionalProperties = {}): boolean {
        const properties = super.getProperties(context, additionalProperties) as SelectTokenProperties;
        return !!properties.targets && properties.player !== Players.Opponent;
    }
}
