import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, CardTypes } from '../../Constants.js';

class HirumaSignaller extends DrawCard {
    static id = 'hiruma-signaller';

    setupCardAbilities() {
        this.action({
            title: 'Sacrifice this card to ready and move a character to the conflict',
            cost: AbilityDsl.costs.sacrificeSelf(),
            condition: context => context.source.isDefending(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.ready(),
                    AbilityDsl.actions.moveToConflict()
                ])
            },
            effect: 'ready and move {0} to the conflict'
        });
    }
}


export default HirumaSignaller;

