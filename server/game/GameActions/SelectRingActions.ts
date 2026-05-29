import type { AbilityContext } from '../AbilityContext.js';
import type { Event } from '../Events/Event.js';
import { Players } from '../Constants.js';
import type Player from '../player.js';
import type Ring from '../ring.js';
import type { GameAction } from './GameAction.js';
import { RingAction, type RingActionProperties } from './RingAction.js';

export interface SelectRingProperties extends RingActionProperties {
    activePromptTitle?: string;
    player?: Players.Self | Players.Opponent;
    targets?: boolean;
    ringCondition?: (ring: Ring, context: AbilityContext) => boolean;
    cancelHandler?: () => void;
    subActionProperties?: (ring: Ring) => Record<string, unknown>;
    message?: string;
    messageArgs?: (ring: Ring, player: Player) => unknown[];
    gameAction: GameAction;
}

type ResolvedSelectRingProperties = SelectRingProperties & {
    ringCondition: NonNullable<SelectRingProperties['ringCondition']>;
    subActionProperties: NonNullable<SelectRingProperties['subActionProperties']>;
};

export class SelectRingAction extends RingAction {
    defaultProperties: SelectRingProperties = {
        ringCondition: () => true,
        subActionProperties: (ring) => ({ target: ring }),
        gameAction: null as unknown as GameAction
    };

    constructor(properties: SelectRingProperties | ((context: AbilityContext) => SelectRingProperties)) {
        super(properties);
    }

    getEffectMessage(context: AbilityContext): [string, unknown[]] {
        let { target } = this.getProperties(context);
        return ['choose a ring for {0}', [target]];
    }

    getProperties(context: AbilityContext, additionalProperties = {}): ResolvedSelectRingProperties {
        const properties = super.getProperties(context, additionalProperties) as SelectRingProperties;
        const ringCondition = properties.ringCondition ?? (() => true);
        const subActionProperties = properties.subActionProperties ?? ((ring: Ring) => ({ target: ring }));
        return Object.assign(properties, { ringCondition, subActionProperties });
    }

    canAffect(ring: Ring, context: AbilityContext, additionalProperties = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        if(properties.player === Players.Opponent && !context.player.opponent) {
            return false;
        }
        return (
            super.canAffect(ring, context) &&
            properties.ringCondition(ring, context) &&
            properties.gameAction.hasLegalTarget(
                context,
                Object.assign({}, additionalProperties, properties.subActionProperties(ring))
            )
        );
    }

    hasLegalTarget(context: AbilityContext, additionalProperties = {}): boolean {
        return Object.values(context.game.rings).some((ring: Ring) =>
            this.canAffect(ring, context, additionalProperties)
        );
    }

    addEventsToArray(events: Event[], context: AbilityContext, additionalProperties = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        if(properties.player === Players.Opponent && !context.player.opponent) {
            return;
        } else if(
            !Object.values(context.game.rings).some((ring: Ring): boolean => properties.ringCondition(ring, context))
        ) {
            return;
        } else if(!this.hasLegalTarget(context, additionalProperties)) {
            return;
        }
        let player: Player = (properties.player === Players.Opponent ? context.player.opponent : context.player) as Player;
        if(properties.targets && context.choosingPlayerOverride) {
            player = context.choosingPlayerOverride;
        }
        const messageArgs = properties.messageArgs;
        const defaultProperties = {
            context: context,
            buttons: properties.cancelHandler ? [{ text: 'Cancel', arg: 'cancel' }] : [],
            onCancel: properties.cancelHandler,
            onSelect: (selectingPlayer: Player, ring: Ring) => {
                if(properties.message && messageArgs) {
                    context.game.addMessage(properties.message, ...messageArgs(ring, selectingPlayer));
                }
                properties.gameAction.addEventsToArray(
                    events,
                    context,
                    Object.assign({}, additionalProperties, properties.subActionProperties(ring))
                );
                return true;
            }
        };
        context.game.promptForRingSelect(
            player,
            Object.assign(defaultProperties, properties, {
                ringCondition: (ring: Ring, ringContext: AbilityContext) =>
                    properties.ringCondition(ring, ringContext) &&
                    properties.gameAction.hasLegalTarget(
                        ringContext,
                        Object.assign({}, additionalProperties, properties.subActionProperties(ring))
                    )
            })
        );
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext, additionalProperties = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return !!properties.targets && properties.player !== Players.Opponent;
    }
}
