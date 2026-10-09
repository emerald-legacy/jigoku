import { gainAbility } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

export default class ScarletSabre extends DrawCard {
    static id = 'scarlet-sabre';

    setupCardAbilities() {
        this.whileAttached({
            match: (card) => card.controller.firstPlayer,
            effect: gainAbility.reaction('Make opponent lose 1 fate', {
                afterConflict: (event, context) =>
                    context.player.opponent &&
                    context.source.isParticipating() &&
                    event.conflict.winner === context.source.controller
            }, (ability) => ability.loseFate((context) => ({ target: context.player.opponent })))
        });
    }
}
