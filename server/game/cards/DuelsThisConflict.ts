import type BaseCard from '../BaseCard.js';
import { EventName } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type { Duel } from '../Duel.js';
import { EventRegistrar } from '../EventRegistrar.js';
import type { EventPayload } from '../Events/EventPayloads.js';
import type Game from '../Game.js';

/** Records the characters `select` picks from each duel this conflict. A character that enters play again is a new instance (RRG 640) and is forgotten. */
export class DuelsThisConflict {
    private cards = new Set<BaseCard>();

    static winners(game: Game) {
        return new DuelsThisConflict(game, (duel) => duel.winner ?? []);
    }

    static losers(game: Game) {
        return new DuelsThisConflict(game, (duel) => duel.loser ?? []);
    }

    static participants(game: Game) {
        return new DuelsThisConflict(game, (duel) => [duel.challenger, ...duel.targets]);
    }

    constructor(game: Game, private select: (duel: Duel) => DrawCard[]) {
        new EventRegistrar(game).register({
            [EventName.OnConflictFinished]: () => this.onConflictFinished(),
            [EventName.AfterDuel]: (event) => this.afterDuel(event),
            [EventName.OnCharacterEntersPlay]: (event) => this.onCharacterEntersPlay(event)
        });
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
