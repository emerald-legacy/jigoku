import AbilityDsl from '../../abilitydsl.js';
import { AbilityType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

export default class ScarletSabre extends DrawCard {
    static id = 'scarlet-sabre';

    setupCardAbilities() {
        this.whileAttached({
            match: (card) => card.controller.firstPlayer,
            effect: AbilityDsl.effects.gainAbility(AbilityType.Reaction, {
                title: 'Make opponent lose 1 fate',
                printedAbility: false,
                when: {
                    afterConflict: (event, context) =>
                        context.player.opponent &&
                        context.source.isParticipating() &&
                        event.conflict.winner === context.source.controller
                },
                gameAction: AbilityDsl.actions.loseFate((context) => ({ target: context.player.opponent }))
            })
        });
    }
}
