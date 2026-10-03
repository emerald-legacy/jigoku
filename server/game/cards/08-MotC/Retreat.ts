import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class Retreat extends DrawCard {
    static id = 'retreat';

    setupCardAbilities() {
        this.action('Move a character home')
            .condition(() => this.game.isDuringConflict('military'))
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Self
            }, AbilityDsl.actions.sendHome());
    }
}


export default Retreat;
