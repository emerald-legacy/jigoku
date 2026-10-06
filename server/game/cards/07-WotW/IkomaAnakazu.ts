import { EventName } from '../../Constants.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import { modifyBothSkills } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import type { EventPayload } from '../../Events/EventPayloads.js';

export default class IkomaAnakazu extends DrawCard {
    static id = 'ikoma-anakazu';

    private brokenProvincesThisPhase = new Map<string, number>();

    public setupCardAbilities() {
        new EventRegistrar(this.game, this).register([EventName.OnBreakProvince, EventName.OnPhaseEnded]);

        this.persistentEffect({
            condition: (context) =>
                !!(context.source.isParticipating() &&
                context.player.opponent &&
                (this.brokenProvincesThisPhase.get(context.player.opponent.name) ?? 0) > 0),
            effect: modifyBothSkills(3)
        });
    }

    public onPhaseEnded() {
        this.brokenProvincesThisPhase.clear();
    }

    public onBreakProvince(event: EventPayload<EventName.OnBreakProvince>) {
        if(event.conflict) {
            const oldValue = this.brokenProvincesThisPhase.get(event.conflict.attackingPlayer.name) || 0;
            this.brokenProvincesThisPhase.set(event.conflict.attackingPlayer.name, oldValue + 1);
        }
    }
}
