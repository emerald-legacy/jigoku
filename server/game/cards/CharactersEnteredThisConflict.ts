import type BaseCard from '../BaseCard.js';
import type { Conflict } from '../Conflict.js';
import { EventName } from '../Constants.js';
import { EventRegistrar } from '../EventRegistrar.js';
import type { EventPayload } from '../Events/EventPayloads.js';
import type Game from '../Game.js';

export class CharactersEnteredThisConflict {
    // the conflict each character last entered play in; a conflict exists from its declaration on
    private enteredIn = new WeakMap<BaseCard, Conflict | null>();

    constructor(private game: Game) {
        new EventRegistrar(game).register({
            [EventName.OnCharacterEntersPlay]: (event) => this.onCharacterEntersPlay(event)
        });
    }

    public has(card: BaseCard): boolean {
        const conflict = this.game.currentConflict;
        return !!conflict && this.enteredIn.get(card) === conflict;
    }

    public onCharacterEntersPlay(event: EventPayload<EventName.OnCharacterEntersPlay>) {
        this.enteredIn.set(event.card, this.game.currentConflict);
    }
}
