import { msg } from '../../GameChat.js';
import { AbilityType, EventName } from '../../Constants.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import type { GameEvent } from '../../Events/EventPayloads.js';
import { ProvinceCard } from '../../ProvinceCard.js';

export default class Pilgrimage extends ProvinceCard {
    static id = 'pilgrimage';

    public setupCardAbilities() {
        const eventRegistrar = new EventRegistrar(this.game);
        eventRegistrar.registerTriggerWindow(EventName.OnResolveRingElement, AbilityType.WouldInterrupt, (event) => this.cancelRingEffect(event));
    }

    public cancelRingEffect(event: GameEvent<EventName.OnResolveRingElement>) {
        const province = this.conflictProvinceWithText();
        if(province && !event.cancelled) {
            event.cancel();
            this.game.addMessage(msg`${province} cancels the ring effect`);
        }
    }
}
