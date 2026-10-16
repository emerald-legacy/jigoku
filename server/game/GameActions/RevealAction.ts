import { msg } from '../GameChat.js';
import type { ActionOverrides } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { EventName, Location } from '../Constants.js';
import type Player from '../Player.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';

export interface RevealProperties extends CardActionProperties {
    chatMessage?: boolean;
    player?: Player;
    onDeclaration?: boolean;
}

export class RevealAction<Context extends AbilityContext = AbilityContext> extends CardGameAction<RevealProperties, EventName.OnCardRevealed, Context, 'chatMessage'> {
    override name = 'reveal';
    override eventName = EventName.OnCardRevealed;
    override effect = 'reveal a card';
    override cost = 'revealing {0}';
    override defaultProperties = { chatMessage: false };
    override canAffect(card: BaseCard, context: Context): boolean {
        if(!card.isFacedown() && (card.isInProvince() || card.location === Location.PlayArea)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    override addPropertiesToEvent(event: ActionEvent<EventName.OnCardRevealed, Context>, card: BaseCard, context: Context, additionalProperties: ActionOverrides = {}): void {
        const { onDeclaration } = this.getProperties(context, additionalProperties);
        event.onDeclaration = onDeclaration;
        super.addPropertiesToEvent(event, card, context, additionalProperties);
    }

    override eventHandler(event: ActionEvent<EventName.OnCardRevealed, Context>, additionalProperties: ActionOverrides = {}): void {
        const context = event.context;
        const properties = this.getProperties(context, additionalProperties);
        if(properties.chatMessage) {
            context.game.addMessage(msg`${properties.player || context.player} reveals ${event.card} due to ${context.source}`);
        }
        event.card.facedown = false;
    }
}
