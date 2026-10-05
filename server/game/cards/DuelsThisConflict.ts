import type BaseCard from '../BaseCard.js';
import { EventName } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type { Duel } from '../Duel.js';
import { EventRegistrar } from '../EventRegistrar.js';
import type { EventPayload } from '../Events/EventPayloads.js';
import type Game from '../Game.js';

/** Records the characters `select` picks from each duel this conflict; `forgetOnEnterPlay` drops a character that enters play again. */
export class DuelsThisConflict {
    private cards = new Set<BaseCard>();

    static winners(game: Game, options?: { forgetOnEnterPlay?: boolean }) {
        return new DuelsThisConflict(game, (duel) => duel.winner ?? [], options);
    }

    static losers(game: Game, options?: { forgetOnEnterPlay?: boolean }) {
        return new DuelsThisConflict(game, (duel) => duel.loser ?? [], options);
    }

    static participants(game: Game, options?: { forgetOnEnterPlay?: boolean }) {
        return new DuelsThisConflict(game, (duel) => [duel.challenger, ...duel.targets], options);
    }

    constructor(game: Game, private select: (duel: Duel) => DrawCard[], { forgetOnEnterPlay = false } = {}) {
        new EventRegistrar(game, this).register(forgetOnEnterPlay
            ? [EventName.OnConflictFinished, EventName.AfterDuel, EventName.OnCharacterEntersPlay]
            : [EventName.OnConflictFinished, EventName.AfterDuel]);
    }

    public has(card: BaseCard): boolean {
        return this.cards.has(card);
    }

    public onConflictFinished() {
        this.cards.clear();
    }

    public afterDuel(event: EventPayload<EventName.AfterDuel>) {
        for(const card of this.select(event.duel)) {
            this.cards.add(card);
        }
    }

    public onCharacterEntersPlay(event: EventPayload<EventName.OnCharacterEntersPlay>) {
        this.cards.delete(event.card);
    }
}
