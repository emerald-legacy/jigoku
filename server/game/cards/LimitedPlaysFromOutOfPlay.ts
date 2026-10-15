import { msg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { delayedEffect } from '../effects.js';
import { handler } from '../GameActions/GameActions.js';
import { EventName } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import { EventRegistrar } from '../EventRegistrar.js';
import type { EventPayload } from '../Events/EventPayloads.js';

type CardPlayed = EventPayload<EventName.OnCardPlayed>;

interface LimitedPlaysOptions<T extends DrawCard> {
    /** "(Max N per round.)" */
    max: number;
    /** While the card lets its player play these cards. */
    active: (context: AbilityContext<T>) => boolean;
    /** Whether this play is one the card allows, such as the top card of the conflict deck. */
    allows: (event: CardPlayed, context: AbilityContext<T>) => boolean;
    /** After "{player} ", for example "plays a card from their conflict deck". */
    description: string;
    /** Once a play counts, for example removing the played card from the game. */
    afterPlay?: (event: CardPlayed, context: AbilityContext<T>) => void;
}

/**
 * "You may play … as if it were in your hand (max N per round)": counts the plays this card allowed.
 * The count starts again at the end of the round and when the card enters play.
 */
export class LimitedPlaysFromOutOfPlay<T extends DrawCard> {
    private played = 0;
    private mostRecentEvent?: CardPlayed;

    constructor(
        private readonly card: T,
        private readonly options: LimitedPlaysOptions<T>
    ) {
        new EventRegistrar(card.game).register({
            [EventName.OnRoundEnded]: () => this.onRoundEnded(),
            [EventName.OnCharacterEntersPlay]: (event) => this.onCharacterEntersPlay(event)
        });
        card.persistentEffect({
            effect: delayedEffect<T>({
                when: {
                    onCardPlayed: (event, context) => {
                        if(!this.available) {
                            return false;
                        }
                        this.mostRecentEvent = event;
                        return (
                            !event.onPlayCardSource &&
                            !event.playedFromOutOfPlaySource &&
                            !event.limitedPlaySource &&
                            event.player === context.player &&
                            options.active(context) &&
                            options.allows(event, context)
                        );
                    }
                },
                gameAction: handler({
                    handler: (context: AbilityContext<T>) => this.count(context)
                })
            })
        });
    }

    /** Whether the card still allows a play this round. */
    get available(): boolean {
        return this.played < this.options.max;
    }

    private count(context: AbilityContext<T>): void {
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

    public onRoundEnded() {
        this.played = 0;
    }

    public onCharacterEntersPlay(event: EventPayload<EventName.OnCharacterEntersPlay>) {
        if(event.card === this.card) {
            this.played = 0;
        }
    }
}
