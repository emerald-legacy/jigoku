import { gainAbility } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

export default class ScarletSabre extends DrawCard {
    static id = 'scarlet-sabre';

    override setupCardAbilities() {
        this.whileAttached({
            condition: (context) => context.source.controller.firstPlayer,
            effect: gainAbility.reaction('Make opponent lose 1 fate', (ability) => ability
                .when({
                    afterConflict: (event, context) =>
                        context.player.opponent &&
                        event.conflict.isOnWinningSide(context.source)
                })
                .loseFate((context) => ({ target: context.player.opponent })))
        });
    }
}
