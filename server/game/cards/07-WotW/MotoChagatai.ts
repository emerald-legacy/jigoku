import { EventName } from '../../Constants.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import { doesNotBow } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import type { EventPayload } from '../../Events/EventPayloads.js';

export default class MotoChagatai extends DrawCard {
    static id = 'moto-chagatai';

    private provinceBroken = new Map<string, boolean>();

    public setupCardAbilities() {
        new EventRegistrar(this.game, this).register([EventName.OnBreakProvince, EventName.OnConflictFinished]);

        this.persistentEffect({
            condition: (context) =>
                Boolean(context.source.isAttacking() && context.player.opponent && this.provinceBroken.get(context.player.opponent.uuid)),
            effect: doesNotBow()
        });
    }

    public onBreakProvince(event: EventPayload<EventName.OnBreakProvince>) {
        this.provinceBroken.set(event.card.controller.uuid, true);
    }

    public onConflictFinished() {
        this.provinceBroken.clear();
    }
}
