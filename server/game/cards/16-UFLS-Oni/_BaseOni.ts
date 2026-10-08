import { msg } from '../../GameChat.js';
import { EventName, Location } from '../../Constants.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import type { GameEvent } from '../../Events/EventPayloads.js';
import DrawCard from '../../DrawCard.js';

export class BaseOni extends DrawCard {
    public setupCardAbilities() {
        new EventRegistrar(this.game, this).register([EventName.OnCardLeavesPlay]);
    }

    public onCardLeavesPlay(event: GameEvent<EventName.OnCardLeavesPlay>) {
        if(event.card === this && this.location !== Location.RemovedFromGame) {
            this.game.addMessage(msg`${this} is removed from the game due to being a Shadowlands character`);
            this.owner.moveCard(this, Location.RemovedFromGame);
        }
    }
}
