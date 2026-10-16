import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CompositeGameAction } from './CompositeGameAction.js';
import type Player from '../Player.js';
import { resolveChoosingPlayer, type Chooser } from './resolveChoosingPlayer.js';
import type { GameAction, GameActionProperties } from './GameAction.js';

export interface OptionalProperties<Context extends AbilityContext = AbilityContext> extends GameActionProperties {
    gameAction: GameAction;
    activePromptTitle: string;
    player?: Chooser;
    /** Resolves without asking, when declining isn't allowed (the rest of the ability did nothing). */
    required?: boolean;
    acceptMessage?(context: Context, chooser: Player): MessageArgs;
    declineMessage?(context: Context, chooser: Player): MessageArgs;
}

/** A player may resolve its game action; a `then()` step after it runs only if they did and it resolved. */
export class OptionalAction<Context extends AbilityContext = AbilityContext> extends CompositeGameAction<OptionalProperties, Context> {
    protected children(properties: OptionalProperties) {
        return [properties.gameAction];
    }

    override getEffectMessage(context: Context, additionalProperties: ActionOverrides = {}): MessageArgs {
        const { properties, overrides } = this.getCompositeProperties(context, additionalProperties);
        return properties.gameAction.getEffectMessage(context, overrides);
    }

    override addEventsToArray(events: Event[], context: Context, additionalProperties: ActionOverrides = {}): void {
        const { properties, overrides } = this.getCompositeProperties(context, additionalProperties);
        const chooser = resolveChoosingPlayer(context, properties.player);
        if(!chooser) {
            return;
        }
        const accept = () => {
            properties.gameAction.addEventsToArray(events, context, overrides);
            if(properties.acceptMessage) {
                context.game.addMessage(properties.acceptMessage(context, chooser));
            }
        };
        if(properties.required) {
            accept();
            return;
        }
        context.game.promptWithHandlerMenu(chooser, {
            activePromptTitle: properties.activePromptTitle,
            source: context.source,
            options: [
                { text: 'Yes', handler: accept },
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
