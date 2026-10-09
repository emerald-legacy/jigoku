import DrawCard from '../../DrawCard.js';
import { honor, sequential } from '../../GameActions/GameActions.js';
import { Players, CardType } from '../../Constants.js';

class SoulBeyondReproach extends DrawCard {
    static id = 'soul-beyond-reproach';

    setupCardAbilities() {
        this.action('Honor a character, then honor it again')
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, sequential([
                honor(),
                honor()
            ]))
            .chatText('honor {0}, then honor it again');
    }
}


export default SoulBeyondReproach;
