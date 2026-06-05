import { EventName, Location } from '../../Constants.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import type { GameEvent } from '../../Events/EventPayloads.js';
import DrawCard from '../../DrawCard.js';

export class BaseOni extends DrawCard {
    private eventRegistrar?: EventRegistrar;

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onCardLeavesPlay']);
    }

    public onCardLeavesPlay(event: GameEvent<EventName.OnCardLeavesPlay>) {
        if(event.card === this && this.location !== Location.RemovedFromGame) {
            this.game.addMessage('{0} is removed from the game due to being a Shadowlands character', this);
            this.owner.moveCard(this, Location.RemovedFromGame);
        }
    }
}
