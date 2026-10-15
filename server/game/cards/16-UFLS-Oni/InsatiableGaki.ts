import { BaseOni } from './_BaseOni.js';

export default class InsatiableGaki extends BaseOni {
    static id = 'insatiable-gaki';

    public override setupCardAbilities() {
        super.setupCardAbilities();
        this.reaction('Make opponent discard a card')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller && context.source.isParticipating()
            })
            .chosenDiscard();
    }
}
