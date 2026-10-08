import { msg } from '../../GameChat.js';
import { AbilityType, EventName } from '../../Constants.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import type { GameEvent } from '../../Events/EventPayloads.js';
import { ProvinceCard } from '../../ProvinceCard.js';

export default class Pilgrimage extends ProvinceCard {
    static id = 'pilgrimage';

    public setupCardAbilities() {
        const eventRegistrar = new EventRegistrar(this.game, this);
        eventRegistrar.register([
            {
                [EventName.OnResolveRingElement + ':' + AbilityType.WouldInterrupt]: 'cancelRingEffect'
            }
        ]);
    }

    public cancelRingEffect(event: GameEvent<EventName.OnResolveRingElement>) {
        if(
            !this.isBroken &&
            !this.isBlank() &&
            event.context.game.currentConflict &&
            this.isConflictProvince() &&
            !event.cancelled
        ) {
            event.cancel();
            this.game.addMessage(msg`${this} cancels the ring effect`);
        }
    }
}
