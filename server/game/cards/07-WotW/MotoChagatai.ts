import type { AbilityContext } from '../../AbilityContext.js';
import { EventName } from '../../Constants.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import type { EventPayload } from '../../Events/EventPayloads.js';

export default class MotoChagatai extends DrawCard {
    static id = 'moto-chagatai';

    private provinceBroken = new Map<string, boolean>();
    private eventRegistrar?: EventRegistrar;

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventName.OnBreakProvince, EventName.OnConflictFinished]);

        this.persistentEffect({
            condition: (context: AbilityContext<this>) =>
                Boolean(context.source.isAttacking() && context.player.opponent && this.provinceBroken.get(context.player.opponent.uuid)),
            effect: AbilityDsl.effects.doesNotBow()
        });
    }

    public onBreakProvince(event: EventPayload<EventName.OnBreakProvince>) {
        this.provinceBroken.set(event.card.controller.uuid, true);
    }

    public onConflictFinished() {
        this.provinceBroken.clear();
    }
}
