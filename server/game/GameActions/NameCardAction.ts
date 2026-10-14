import type { AbilityContext } from '../AbilityContext.js';
import type { EventName } from '../Constants.js';
import type { Event } from '../Events/Event.js';
import type { MessageArgs } from '../GameChat.js';
import type Player from '../Player.js';
import { GameAction, type ActionOverrides, type GameActionProperties } from './GameAction.js';
import { resolveChoosingPlayer, type Chooser } from './resolveChoosingPlayer.js';

export interface NameCardProperties<C extends AbilityContext = AbilityContext> extends GameActionProperties {
    /** Who names the card: the ability's player (default) or their opponent. */
    player?: Chooser;
    activePromptTitle?: string;
    gameAction: (cardName: string) => GameAction;
    message?(context: C, cardName: string, chooser: Player): MessageArgs;
}

export class NameCardAction<C extends AbilityContext = AbilityContext> extends GameAction<NameCardProperties, EventName.Unnamed, C> {
    name = 'nameCard';

    protected effectMessage(context: C, additionalProperties: ActionOverrides = {}): MessageArgs {
        const chooser = resolveChoosingPlayer(context, this.getProperties(context, additionalProperties).player);
        return chooser && chooser !== context.player ? ['have {1} name a card', [chooser]] : ['name a card', []];
    }

    hasLegalTarget(context: C, additionalProperties: ActionOverrides = {}): boolean {
        return !!resolveChoosingPlayer(context, this.getProperties(context, additionalProperties).player);
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        const chooser = resolveChoosingPlayer(context, properties.player);
        if(!chooser) {
            return;
        }
        context.game.promptForCardName(chooser, (player, cardName) => {
            if(properties.message) {
                context.game.addMessage(properties.message(context, cardName, player));
            }
            context.game.queueSimpleStep(() => properties.gameAction(cardName).addEventsToArray(events, context));
        }, properties.activePromptTitle);
    }
}
