import { doesNotBow } from '../../effects.js';
import { cardLastingEffect, multiple, placeFate } from '../../GameActions/GameActions.js';
import { BaseOni } from './_BaseOni.js';

export default class DarkMoto extends BaseOni {
    static id = 'dark-moto';

    public setupCardAbilities() {
        super.setupCardAbilities();
        this.reaction('Place a fate and prevent from bowing')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller && context.source.isParticipating()
            })
            .gameAction(multiple([
                placeFate((context) => ({
                    target: context.source,
                    origin: context.player
                })),
                cardLastingEffect((context) => ({
                    target: context.source,
                    effect: doesNotBow()
                }))
            ]))
            .chatText('place a fate on and prevent {0} from bowing as a result of conflict resolution');
    }
}
