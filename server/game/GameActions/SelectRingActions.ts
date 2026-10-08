import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { Event } from '../Events/Event.js';
import { Players, type EventName } from '../Constants.js';
import type Player from '../Player.js';
import type Ring from '../Ring.js';
import type { GameAction } from './GameAction.js';
import { RingAction, type RingActionProperties } from './RingAction.js';

export interface SelectRingProperties<C extends AbilityContext = AbilityContext> extends RingActionProperties {
    activePromptTitle?: string;
    player?: Players.Self | Players.Opponent;
    targets?: boolean;
    ringCondition?: (ring: Ring, context: AbilityContext) => boolean;
    cancelHandler?: () => void;
    subActionProperties?: (ring: Ring) => Record<string, unknown>;
    /** The chat line once a ring is chosen. */
    message?: (context: C, ring: Ring, chooser: Player) => MessageArgs;
    gameAction: GameAction;
}

export class SelectRingAction<C extends AbilityContext = AbilityContext> extends RingAction<SelectRingProperties<C>, EventName, C, 'ringCondition' | 'subActionProperties'> {
    defaultProperties = {
        ringCondition: () => true,
        subActionProperties: (ring: Ring) => ({ target: ring })
    };

    protected effectMessage(): MessageArgs {
        return ['choose a ring for {0}', []];
    }

    canAffect(ring: Ring, context: C, additionalProperties: ActionOverrides = {}): boolean {
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

    hasLegalTarget(context: C, additionalProperties: ActionOverrides = {}): boolean {
        return Object.values(context.game.rings).some((ring) =>
            this.canAffect(ring, context, additionalProperties)
        );
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        if(properties.player === Players.Opponent && !context.player.opponent) {
            return;
        } else if(
            !Object.values(context.game.rings).some((ring) => properties.ringCondition(ring, context))
        ) {
            return;
        } else if(!this.hasLegalTarget(context, additionalProperties)) {
            return;
        }
        const opponent = context.player.opponent;
        let player: Player = properties.player === Players.Opponent && opponent ? opponent : context.player;
        if(properties.targets && context.choosingPlayerOverride) {
            player = context.choosingPlayerOverride;
        }
        const defaultProperties = {
            context: context,
            buttons: properties.cancelHandler ? [{ text: 'Cancel', arg: 'cancel' }] : [],
            onCancel: properties.cancelHandler,
            onSelect: (selectingPlayer: Player, ring: Ring) => {
                if(properties.message) {
                    context.game.addMessage(properties.message(context, ring, selectingPlayer));
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
            {
                ...defaultProperties,
                ...properties,
                ringCondition: (ring: Ring, ringContext: AbilityContext) =>
                    properties.ringCondition(ring, ringContext) &&
                    properties.gameAction.hasLegalTarget(
                        ringContext,
                        Object.assign({}, additionalProperties, properties.subActionProperties(ring))
                    )
            }
        );
    }

    hasTargetsChosenByInitiatingPlayer(context: C, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return !!properties.targets && properties.player !== Players.Opponent;
    }
}
