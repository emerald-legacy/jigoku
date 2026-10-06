import AbilityDsl from '../../abilitydsl.js';
import { gainAbility } from '../../effects.js';
import { chosenDiscard } from '../../GameActions/GameActions.js';
import { AbilityType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

export default class SturdyTetsubo extends DrawCard {
    static id = 'sturdy-tetsubo';

    setupCardAbilities() {
        this.whileAttached({
            effect: gainAbility(AbilityType.Reaction, {
                title: 'Make opponent discard 1 card',
                limit: AbilityDsl.limit.perRound(2),
                printedAbility: false,
                when: {
                    afterConflict: (event, context) =>
                        context.player.opponent &&
                        context.source.isParticipating() &&
                        event.conflict.winner === context.source.controller
                },
                gameAction: chosenDiscard()
            })
        });
    }
}
