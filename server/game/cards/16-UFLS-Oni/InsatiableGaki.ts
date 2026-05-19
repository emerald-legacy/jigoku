import AbilityDsl from '../../abilitydsl.js';
import { BaseOni } from './_BaseOni.js';

export default class InsatiableGaki extends BaseOni {
    static id = 'insatiable-gaki';

    public setupCardAbilities() {
        super.setupCardAbilities();
        this.reaction({
            title: 'Make opponent discard a card',
            when: {
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller && context.source.isParticipating()
            },
            gameAction: AbilityDsl.actions.chosenDiscard({ amount: 1 })
        });
    }
}
