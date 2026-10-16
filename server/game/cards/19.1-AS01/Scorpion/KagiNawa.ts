import { gainAbility } from '../../../effects.js';
import { moveToConflict } from '../../../GameActions/GameActions.js';
import { CardType, Players, Trait } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class KagiNawa extends DrawCard {
    static id = 'kagi-nawa';

    override setupCardAbilities() {
        this.whileAttached({
            match: (card) => card.hasTrait(Trait.Shinobi),
            effect: gainAbility.conflictAction('Move a character to the conflict', (ability) => ability
                .target({
                    cardType: CardType.Character,
                    controller: Players.Any,
                    activePromptTitle: 'Choose a character with printed cost 2 or lower to move in',
                    cardCondition: (card) => (card.printedCost ?? 0) <= 2
                }, moveToConflict())
                .chatText('hook {0} and drag them into the conflict'))
        });
    }
}
