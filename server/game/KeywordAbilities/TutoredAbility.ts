import { msg } from '../GameChat.js';
import * as AbilityLimit from '../AbilityLimit.js';
import { AbilityType, type EventName, Location } from '../Constants.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import type DrawCard from '../DrawCard.js';
import { TriggeredAbility } from '../TriggeredAbility.js';
import type { EventPayload } from '../Events/EventPayloads.js';
import { attach } from '../GameActions/GameActions.js';

// RRG "Tutored – X": the discard pile, then the conflict deck, then the hand
const SEARCHED = [Location.ConflictDiscardPile, Location.ConflictDeck, Location.Hand] as const;

/** "Tutored – X": after this character enters play, find an attachment named X and put it into play attached to it. */
export class TutoredAbility extends TriggeredAbility<DrawCard> {
    constructor(card: DrawCard, private attachmentName: string) {
        super(card, AbilityType.KeywordReaction, {
            when: {
                onCharacterEntersPlay: (event: EventPayload<EventName.OnCharacterEntersPlay>, context: TriggeredAbilityContext<DrawCard>) =>
                    event.card === context.source
            },
            title: `${card.name}'s Tutored`,
            printedAbility: false,
            limit: AbilityLimit.unlimited(),
            handler: (context: TriggeredAbilityContext<DrawCard>) => this.search(context, 0)
        });
    }

    // a player isn't obliged to find the card (RRG Search), so taking nothing moves on to the next area
    private search(context: TriggeredAbilityContext<DrawCard>, index: number): void {
        const location = SEARCHED[index];
        if(!location) {
            return;
        }
        const next = () => {
            if(location === Location.ConflictDeck) {
                context.player.shuffleConflictDeck();
            }
            this.search(context, index + 1);
        };
        const cards = context.player.getSourceList(location).filter((card) =>
            card.name === this.attachmentName && attach({ attachment: card }).canAffect(context.source, context));
        if(cards.length === 0) {
            next();
            return;
        }
        context.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: `Choose a ${this.attachmentName}`,
            context,
            cards,
            options: [{ text: 'Take nothing', handler: next }],
            cardHandler: (card: DrawCard) => {
                context.game.addMessage(msg`${context.source} receives their ${card}`);
                context.game.resolveActions([attach({ target: context.source, attachment: card })], context);
                if(location === Location.ConflictDeck) {
                    context.player.shuffleConflictDeck();
                }
            }
        });
    }

    isTriggeredAbility() {
        return false;
    }

    isKeywordAbility() {
        return true;
    }
}
