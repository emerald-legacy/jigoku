import { Locations } from '../../Constants.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import DrawCard from '../../DrawCard.js';

export class BaseOni extends DrawCard {
    private eventRegistrar?: EventRegistrar;

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onCardLeavesPlay']);
    }

    public onCardLeavesPlay(event: any) {
        if(event.card === this && this.location !== Locations.RemovedFromGame) {
            this.game.addMessage('{0} is removed from the game due to being a Shadowlands character', this);
            this.owner.moveCard(this, Locations.RemovedFromGame);
        }
    }
}
