import { ConflictType, EventName } from '../../Constants.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class IvoryKingdomsUnicorn extends DrawCard {
    static id = 'ivory-kingdoms-unicorn';

    private attackingAtConflictResolution = false;
    private provinceBroken = false;
    private eventRegistrar?: EventRegistrar;

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([
            EventName.AfterConflict,
            EventName.OnBreakProvince,
            EventName.OnConflictDeclared
        ]);

        this.reaction({
            title: 'Immediately declare a military conflict',
            when: {
                onConflictFinished: () => this.provinceBroken && this.attackingAtConflictResolution
            },
            gameAction: AbilityDsl.actions.initiateConflict({
                canPass: false,
                forcedDeclaredType: ConflictType.Military
            })
        });
    }

    public afterConflict() {
        this.attackingAtConflictResolution = this.isAttacking();
    }

    public onBreakProvince() {
        this.provinceBroken = true;
    }

    public onConflictDeclared() {
        this.attackingAtConflictResolution = false;
        this.provinceBroken = false;
    }
}
