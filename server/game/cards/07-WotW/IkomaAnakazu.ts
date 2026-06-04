import type { AbilityContext } from '../../AbilityContext.js';
import { EventName } from '../../Constants.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import type { EventPayload } from '../../Events/EventPayloads.js';

export default class IkomaAnakazu extends DrawCard {
    static id = 'ikoma-anakazu';

    private brokenProvincesThisPhase = new Map<string, number>();
    private eventRegistrar?: EventRegistrar;

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventName.OnBreakProvince, EventName.OnPhaseEnded]);

        this.persistentEffect({
            condition: (context: AbilityContext) =>
                !!((context.source as DrawCard).isParticipating() &&
                context.player.opponent &&
                (this.brokenProvincesThisPhase.get(context.player.opponent.name) ?? 0) > 0),
            effect: AbilityDsl.effects.modifyBothSkills(3)
        });
    }

    public onPhaseEnded() {
        this.brokenProvincesThisPhase.clear();
    }

    public onBreakProvince(event: EventPayload<EventName.OnBreakProvince>) {
        if(event.conflict && event.conflict.attackingPlayer) {
            const oldValue = this.brokenProvincesThisPhase.get(event.conflict.attackingPlayer.name) || 0;
            this.brokenProvincesThisPhase.set(event.conflict.attackingPlayer.name, oldValue + 1);
        }
    }
}
