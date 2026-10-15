import { msg } from '../GameChat.js';
import { AbilityType, type EventName } from '../Constants.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import type DrawCard from '../DrawCard.js';
import type { GameAction } from '../GameActions/GameAction.js';
import { TriggeredAbility } from '../TriggeredAbility.js';
import type { EventPayload } from '../Events/EventPayloads.js';

interface LeavesPlayKeyword {
    name: string;
    hasKeyword(card: DrawCard): boolean;
    /** What the chat says the player gets: "gains a fate" in "{player} gains a fate due to {card}'s Courtesy". */
    gain: string;
    gameAction(context: TriggeredAbilityContext): GameAction;
}

/** A keyword whose interrupt gives its controller something when the card leaves play (Courtesy, Sincerity). */
export class LeavesPlayKeywordAbility extends TriggeredAbility<DrawCard> {
    constructor(card: DrawCard, keyword: LeavesPlayKeyword) {
        super(card, AbilityType.KeywordInterrupt, {
            when: {
                onCardLeavesPlay: (event: EventPayload<EventName.OnCardLeavesPlay>, context: TriggeredAbilityContext<DrawCard>) =>
                    event.card === context.source && keyword.hasKeyword(context.source)
            },
            title: card.name + '\'s ' + keyword.name,
            printedAbility: false,
            message: (context: TriggeredAbilityContext) => msg`${context.player} ${keyword.gain} due to ${context.source}'s ${keyword.name}`,
            handler: (context: TriggeredAbilityContext) => context.game.resolveActions([keyword.gameAction(context)], context)
        });
    }

    isTriggeredAbility() {
        return false;
    }

    isKeywordAbility() {
        return true;
    }
}
