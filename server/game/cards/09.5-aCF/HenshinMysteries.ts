import { msg } from '../../GameChat.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { AbilityType, EventName } from '../../Constants.js';
import type { GameEvent } from '../../Events/EventPayloads.js';

export default class HenshinMysteries extends ProvinceCard {
    static id = 'henshin-mysteries';

    public setupCardAbilities() {
        new EventRegistrar(this.game).registerTriggerWindow(EventName.OnClaimRing, AbilityType.OtherEffects, (event) => this.cancelRingClaim(event));
    }

    public cancelRingClaim(event: GameEvent<EventName.OnClaimRing>) {
        const province = this.conflictProvinceWithText();
        if(event.conflict && province && !event.cancelled) {
            event.cancel();
            this.game.addMessage(msg`${province} cancels the ring being claimed`);
        }
    }
}
