import { gainAbility } from '../../../effects.js';
import { moveToConflict } from '../../../GameActions/GameActions.js';
import { AbilityType, CardType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class KagiNawa extends DrawCard {
    static id = 'kagi-nawa';

    setupCardAbilities() {
        this.whileAttached({
            match: (card) => card.hasTrait('shinobi'),
            effect: gainAbility(AbilityType.Action, {
                title: 'Move a character to the conflict',
                condition: (context) => context.source.isParticipating(),
                target: {
                    cardType: CardType.Character,
                    controller: Players.Any,
                    activePromptTitle: 'Choose a character with printed cost 2 or lower to move in',
                    cardCondition: (card) => (card.printedCost ?? 0) <= 2,
                    gameAction: moveToConflict()
                },
                effect: 'hook {0} and drag them into the conflict'
            })
        });
    }
}
