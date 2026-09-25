import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { EventName, Location } from '../Constants.js';
import type Player from '../Player.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

import type { GameEvent } from '../Events/EventPayloads.js';
export interface RevealProperties extends CardActionProperties {
    chatMessage?: boolean;
    player?: Player;
    onDeclaration?: boolean;
}

export class RevealAction extends CardGameAction<RevealProperties> {
    name = 'reveal';
    eventName = EventName.OnCardRevealed;
    effect = 'reveal a card';
    cost = 'revealing {0}';
    defaultProperties: RevealProperties = { chatMessage: false };
    constructor(properties: ((context: AbilityContext) => RevealProperties) | RevealProperties) {
        super(properties);
    }

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if(!card.isFacedown() && (card.isInProvince() || card.location === Location.PlayArea)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    addPropertiesToEvent(event: GameEvent<EventName.OnCardRevealed>, card: BaseCard, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        let { onDeclaration } = this.getProperties(context, additionalProperties);
        event.onDeclaration = onDeclaration;
        super.addPropertiesToEvent(event, card, context, additionalProperties);
    }

    eventHandler(event: GameEvent<EventName.OnCardRevealed>, additionalProperties: Record<string, unknown> = {}): void {
        const context = event.context;
        const properties = this.getProperties(context, additionalProperties);
        if(properties.chatMessage) {
            context.game.addMessage(
                '{0} reveals {1} due to {2}',
                properties.player || context.player,
                event.card,
                context.source
            );
        }
        (event.card).facedown = false;
    }
}
