import { ConflictType, EventName } from '../../Constants.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import { initiateConflict } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class IvoryKingdomsUnicorn extends DrawCard {
    static id = 'ivory-kingdoms-unicorn';

    private attackingAtConflictResolution = false;
    private provinceBroken = false;

    public setupCardAbilities() {
        new EventRegistrar(this.game).register({
            [EventName.AfterConflict]: () => this.afterConflict(),
            [EventName.OnBreakProvince]: () => this.onBreakProvince(),
            [EventName.OnConflictDeclared]: () => this.onConflictDeclared()
        });

        this.reaction('Immediately declare a military conflict')
            .when({
                onConflictFinished: () => this.provinceBroken && this.attackingAtConflictResolution
            })
            .gameAction(initiateConflict({
                canPass: false,
                forcedDeclaredType: ConflictType.Military
            }));
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
