import type { AbilityContext } from '../../AbilityContext.js';
import { EventNames } from '../../Constants.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class MotoChagatai extends DrawCard {
    static id = 'moto-chagatai';

    private provinceBroken = new Map<string, boolean>();
    private eventRegistrar?: EventRegistrar;

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventNames.OnBreakProvince, EventNames.OnConflictFinished]);

        this.persistentEffect({
            condition: (context: AbilityContext) =>
                Boolean(context.source.isAttacking() && context.player.opponent && this.provinceBroken.get(context.player.opponent.uuid)),
            effect: AbilityDsl.effects.doesNotBow()
        });
    }

    public onBreakProvince(event: any) {
        this.provinceBroken.set(event.card.controller.uuid, true);
    }

    public onConflictFinished() {
        this.provinceBroken.clear();
    }
}
