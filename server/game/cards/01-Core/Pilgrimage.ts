import { AbilityType, EventName } from '../../Constants.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import { ProvinceCard } from '../../ProvinceCard.js';

export default class Pilgrimage extends ProvinceCard {
    static id = 'pilgrimage';

    private eventRegistrar?: EventRegistrar;

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([
            {
                [EventName.OnResolveRingElement + ':' + AbilityType.WouldInterrupt]: 'cancelRingEffect'
            }
        ]);
    }

    public cancelRingEffect(event: any) {
        if(
            !this.isBroken &&
            !this.isBlank() &&
            event.context.game.currentConflict &&
            this.isConflictProvince() &&
            !event.cancelled
        ) {
            event.cancel();
            this.game.addMessage('{0} cancels the ring effect', this);
        }
    }
}
