import { msg } from '../GameChat.js';
import { AbilityContext } from '../AbilityContext.js';
import { delayedEffect } from '../effects.js';
import { handler } from '../GameActions/GameActions.js';
import { EventName } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import { EventRegistrar } from '../EventRegistrar.js';
import type { EventPayload } from '../Events/EventPayloads.js';

type CardPlayed = EventPayload<EventName.OnCardPlayed>;

interface LimitedPlaysOptions<Card extends DrawCard> {
    /** "(Max N per round.)" */
    max: number;
    /** While the card lets its player play these cards. */
    active: (context: AbilityContext<Card>) => boolean;
    /** Whether this play is one the card allows, such as the top card of the conflict deck. */
    allows: (event: CardPlayed, context: AbilityContext<Card>) => boolean;
    /** After "{player} ", for example "plays a card from their conflict deck". */
    description: string;
    /** Once a play counts, for example removing the played card from the game. */
    afterPlay?: (event: CardPlayed, context: AbilityContext<Card>) => void;
}

/**
 * "You may play … as if it were in your hand. You cannot play more than N cards per round this way": counts the plays this card allowed.
 * A play counts once initiated, even if its costs aren't paid.
 * The count starts again at the end of the round and when the card enters play.
 */
export class LimitedPlaysFromOutOfPlay<Card extends DrawCard> {
    private played = 0;
    private mostRecentEvent?: CardPlayed;

    constructor(
        private readonly card: Card,
        private readonly options: LimitedPlaysOptions<Card>
    ) {
        new EventRegistrar(card.game).register({
            [EventName.OnRoundEnded]: () => this.onRoundEnded(),
            [EventName.OnCharacterEntersPlay]: (event) => this.onCharacterEntersPlay(event),
            [EventName.OnCardPlayCostsNotPaid]: (event) => this.onCostsNotPaid(event.playEvent)
        });
        card.persistentEffect({
            effect: delayedEffect<Card>({
                when: {
                    onCardPlayed: (event, context) => {
                        if(!this.available) {
                            return false;
                        }
                        this.mostRecentEvent = event;
                        return this.allowsPlay(event, context);
                    }
                },
                gameAction: handler({
                    handler: (context: AbilityContext<Card>) => this.count(context)
                })
            })
        });
    }

    /** A play this card allowed, not yet counted by another card. */
    private allowsPlay(event: CardPlayed, context: AbilityContext<Card>): boolean {
        return (
            !event.onPlayCardSource &&
            !event.playedFromOutOfPlaySource &&
            !event.limitedPlaySource &&
            event.player === context.player &&
            this.options.active(context) &&
            this.options.allows(event, context)
        );
    }

    /** Whether the card still allows a play this round. */
    get available(): boolean {
        return this.played < this.options.max;
    }

    private count(context: AbilityContext<Card>): void {
        const event = this.mostRecentEvent;
        if(!event || (event.limitedPlaySource && event.limitedPlaySource !== this.card)) {
            return;
        }
        event.limitedPlaySource = this.card;
        this.played++;
        const remaining = this.options.max - this.played;
        context.game.addMessage(msg`${context.player} ${this.options.description} due to the ability of ${context.source} (${remaining} use${remaining === 1 ? '' : 's'} remaining)`);
        this.options.afterPlay?.(event, context);
    }

    private onCostsNotPaid(event: CardPlayed): void {
        const context = new AbilityContext<Card>({ game: this.card.game, source: this.card, player: this.card.controller });
        if(this.available && this.allowsPlay(event, context)) {
            event.limitedPlaySource = this.card;
            this.played++;
        }
    }

    public onRoundEnded() {
        this.played = 0;
    }

    public onCharacterEntersPlay(event: EventPayload<EventName.OnCharacterEntersPlay>) {
        if(event.card === this.card) {
            this.played = 0;
        }
    }
}
