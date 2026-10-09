import type BaseCard from '../BaseCard.js';
import { EventName } from '../Constants.js';
import { EventRegistrar } from '../EventRegistrar.js';
import type { EventPayload } from '../Events/EventPayloads.js';
import type Game from '../Game.js';

export class CharactersEnteredThisConflict {
    private characters = new WeakSet<BaseCard>();

    constructor(game: Game) {
        new EventRegistrar(game).register({
            [EventName.OnConflictStarted]: () => this.onConflictStarted(),
            [EventName.OnCharacterEntersPlay]: (event) => this.onCharacterEntersPlay(event)
        });
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
