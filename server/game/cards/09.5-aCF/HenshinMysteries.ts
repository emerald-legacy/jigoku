import { EventRegistrar } from '../../EventRegistrar.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { AbilityType, EventName } from '../../Constants.js';
import type { GameEvent } from '../../Events/EventPayloads.js';

export default class HenshinMysteries extends ProvinceCard {
    static id = 'henshin-mysteries';

    public setupCardAbilities() {
        new EventRegistrar(this.game, this).register([{ [EventName.OnClaimRing + ':' + AbilityType.OtherEffects]: 'cancelRingClaim' }]);
    }

    public cancelRingClaim(event: GameEvent<EventName.OnClaimRing>) {
        if(
            !this.isBroken &&
            !this.isBlank() &&
            event.conflict &&
            event.conflict.getConflictProvinces().some((a) => a === this) &&
            !event.cancelled
        ) {
            event.cancel();
            this.game.addMessage('{0} cancels the ring being claimed', this);
        }
    }
}
