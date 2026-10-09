import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CompositeGameAction } from './CompositeGameAction.js';
import type { Players } from '../Constants.js';
import type Player from '../Player.js';
import { resolveChoosingPlayer } from './resolveChoosingPlayer.js';
import { GameAction, type GameActionProperties } from './GameAction.js';

export interface OptionalProperties extends GameActionProperties {
    gameAction: GameAction;
    prompt: string;
    /** Who decides: the ability's player (default) or their opponent. */
    player?: Players.Self | Players.Opponent;
    /** The chat line when they do. */
    acceptMessage?: (context: AbilityContext, chooser: Player) => MessageArgs;
    /** The chat line when they don't. */
    declineMessage?: (context: AbilityContext, chooser: Player) => MessageArgs;
}

/** A player may resolve its game action; a `then()` step after it runs only if they did and it resolved. */
export class OptionalAction<C extends AbilityContext = AbilityContext> extends CompositeGameAction<OptionalProperties, C> {
    protected children(properties: OptionalProperties) {
        return [properties.gameAction];
    }

    getEffectMessage(context: C, additionalProperties: ActionOverrides = {}): MessageArgs {
        const { properties, overrides } = this.getCompositeProperties(context, additionalProperties);
        return properties.gameAction.getEffectMessage(context, overrides);
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        const { properties, overrides } = this.getCompositeProperties(context, additionalProperties);
        const chooser = resolveChoosingPlayer(context, properties.player);
        if(!chooser) {
            return;
        }
        context.game.promptWithHandlerMenu(chooser, {
            activePromptTitle: properties.prompt,
            source: context.source,
            options: [
                {
                    text: 'Yes',
                    handler: () => {
                        properties.gameAction.addEventsToArray(events, context, overrides);
                        if(properties.acceptMessage) {
                            context.game.addMessage(properties.acceptMessage(context, chooser));
                        }
                    }
                },
                {
                    text: 'No',
                    handler: () => {
                        if(properties.declineMessage) {
                            context.game.addMessage(properties.declineMessage(context, chooser));
                        }
                    }
                }
            ]
        });
    }
}
