import { gainAbility } from '../../effects.js';
import { loseFate } from '../../GameActions/GameActions.js';
import { AbilityType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

export default class ScarletSabre extends DrawCard {
    static id = 'scarlet-sabre';

    setupCardAbilities() {
        this.whileAttached({
            match: (card) => card.controller.firstPlayer,
            effect: gainAbility(AbilityType.Reaction, {
                title: 'Make opponent lose 1 fate',
                printedAbility: false,
                when: {
                    afterConflict: (event, context) =>
                        context.player.opponent &&
                        context.source.isParticipating() &&
                        event.conflict.winner === context.source.controller
                },
                gameAction: loseFate((context) => ({ target: context.player.opponent }))
            })
        });
    }
}
