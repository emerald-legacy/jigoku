import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { isChosenByAbilityPlayer, resolveChoosingPlayer, type Chooser } from './resolveChoosingPlayer.js';
import type { EventName } from '../Constants.js';
import type { Event } from '../Events/Event.js';
import type Player from '../Player.js';
import type { StatusToken } from '../StatusToken.js';
import type { GameAction } from './GameAction.js';
import { TokenAction, type TokenActionProperties } from './TokenAction.js';

export interface SelectTokenProperties<C extends AbilityContext = AbilityContext> extends TokenActionProperties {
    activePromptTitle?: string;
    card?: BaseCard;
    player?: Chooser;
    targets?: boolean;
    singleToken?: boolean;
    tokenCondition?: (token: StatusToken, context: AbilityContext) => boolean;
    cancelHandler?: () => void;
    subActionProperties?: (tokens: StatusToken | StatusToken[]) => Record<string, unknown>;
    /** The chat line once the tokens are chosen. */
    message?: (context: C, tokens: StatusToken | StatusToken[], chooser: Player) => MessageArgs;
    gameAction: GameAction;
    chatText?: (context: C) => MessageArgs;
}

export class SelectTokenAction<C extends AbilityContext = AbilityContext> extends TokenAction<
    SelectTokenProperties<C>,
    EventName,
    C,
    'activePromptTitle' | 'tokenCondition' | 'singleToken' | 'subActionProperties'
> {
    override name = 'selectToken';
    override defaultProperties = {
        activePromptTitle: 'Which token do you wish to select?',
        tokenCondition: () => true,
        singleToken: true,
        subActionProperties: (tokens: StatusToken | StatusToken[]) => ({ target: tokens })
    };

    override getEffectMessage(context: C, additionalProperties: ActionOverrides = {}): MessageArgs {
        const { chatText } = this.getProperties(context, additionalProperties);
        if(chatText) {
            return chatText(context);
        }
        return super.getEffectMessage(context, additionalProperties);
    }

    protected override effectMessage(): MessageArgs {
        return ['choose a status token for {0}', []];
    }

    private resolveProperties(context: C, additionalProperties: ActionOverrides = {}) {
        const properties = super.getProperties(context, additionalProperties);
        const { card } = properties;
        return card ? Object.assign(properties, { card }) : null;
    }

    override canAffect(token: StatusToken, context: C, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.resolveProperties(context, additionalProperties);
        if(!properties) {
            return false;
        }
        if(!resolveChoosingPlayer(context, properties.player, properties.targets)) {
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

    override hasLegalTarget(context: C, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.resolveProperties(context, additionalProperties);
        if(!properties) {
            return false;
        }
        return properties.card.statusTokens.some((token) => this.canAffect(token, context, additionalProperties));
    }

    override addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        const properties = this.resolveProperties(context, additionalProperties);
        if(!properties) {
            return;
        }
        const player = resolveChoosingPlayer(context, properties.player, properties.targets);
        if(!player) {
            return;
        } else if(!properties.card.statusTokens.some((token) => properties.tokenCondition(token, context))) {
            return;
        } else if(!this.hasLegalTarget(context, additionalProperties)) {
            return;
        }
        const validTokens = properties.card.statusTokens.filter((token) =>
            properties.gameAction.canAffect(token, context)
        );
        if(properties.singleToken && validTokens.length > 1) {
            context.game.promptWithHandlerMenu(player, {
                activePromptTitle: properties.activePromptTitle,
                options: validTokens.map((token) => ({
                    text: token.name,
                    handler: () => {
                        this.#addMessage(properties.message, context, token, player);
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
            this.#addMessage(properties.message, context, validTokens, player);
            properties.gameAction.addEventsToArray(
                events,
                context,
                Object.assign({}, additionalProperties, properties.subActionProperties(validTokens))
            );
        }
    }

    #addMessage(message: SelectTokenProperties<C>['message'], context: C, tokens: StatusToken | StatusToken[], chooser: Player): void {
        if(message) {
            context.game.addMessage(message(context, tokens, chooser));
        }
    }

    override hasTargetsChosenByInitiatingPlayer(context: C, additionalProperties: ActionOverrides = {}): boolean {
        const properties = super.getProperties(context, additionalProperties);
        return !!properties.targets && isChosenByAbilityPlayer(context, properties.player);
    }
}
