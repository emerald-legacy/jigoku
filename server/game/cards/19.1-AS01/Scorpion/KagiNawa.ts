import { gainAbility } from '../../../effects.js';
import { moveToConflict } from '../../../GameActions/GameActions.js';
import { CardType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class KagiNawa extends DrawCard {
    static id = 'kagi-nawa';

    setupCardAbilities() {
        this.whileAttached({
            match: (card) => card.hasTrait('shinobi'),
            effect: gainAbility.action('Move a character to the conflict', (ability) => ability
                .condition((context) => context.source.isParticipating())
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
