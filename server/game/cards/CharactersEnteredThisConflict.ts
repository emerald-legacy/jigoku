import type BaseCard from '../BaseCard.js';
import { EventName } from '../Constants.js';
import { EventRegistrar } from '../EventRegistrar.js';
import type { EventPayload } from '../Events/EventPayloads.js';
import type Game from '../Game.js';

/** Records the characters that entered play since the current conflict started. */
export class CharactersEnteredThisConflict {
    private characters = new WeakSet<BaseCard>();

    constructor(game: Game) {
        new EventRegistrar(game, this).register([EventName.OnConflictStarted, EventName.OnCharacterEntersPlay]);
    }

    public has(card: BaseCard): boolean {
        return this.characters.has(card);
    }

    public onConflictStarted() {
        this.characters = new WeakSet();
    }

    public onCharacterEntersPlay(event: EventPayload<EventName.OnCharacterEntersPlay>) {
        this.characters.add(event.card);
    }
}
