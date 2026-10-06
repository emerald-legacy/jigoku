import { CardType, Players } from '../../../Constants.js';
import { moveToConflict, multiple, sendHome } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class HeirOfTheSerpent extends DrawCard {
    static id = 'heir-of-the-serpent';

    setupCardAbilities() {
        this.action('Move a character into or out of the conflict')
            .condition((context) => context.source.isParticipating())
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, multiple([
                sendHome(),
                moveToConflict()
            ]));
    }
}
