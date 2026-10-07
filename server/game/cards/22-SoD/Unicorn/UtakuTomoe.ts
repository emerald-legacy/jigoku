import { EventName } from '../../../Constants.js';
import { EventRegistrar } from '../../../EventRegistrar.js';
import DrawCard from '../../../DrawCard.js';

export default class UtakuTomoe extends DrawCard {
    static id = 'utaku-tomoe';

    private defendingAtConflictResolution = false;

    setupCardAbilities() {
        new EventRegistrar(this.game, this).register([EventName.AfterConflict, EventName.OnConflictDeclared]);

        // "After the resolution of a conflict" is onConflictFinished, not onReturnHome:
        // until-end-of-conflict effects (e.g. Palm Strike's cannot-ready) expire only
        // once the conflict ends. Participation is captured while it is still known.
        this.reaction('Ready a character or gain honor')
            .when({
                onConflictFinished: () => this.defendingAtConflictResolution
            })
            .if((context) => context.event.conflict.winner === context.source.controller)
                .gainHonor(2)
            .otherwise()
                .ready((context) => ({ target: context.source }));
    }

    public afterConflict() {
        this.defendingAtConflictResolution = this.isDefending();
    }

    public onConflictDeclared() {
        this.defendingAtConflictResolution = false;
    }
}
