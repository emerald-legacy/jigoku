import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, CardType } from '../../Constants.js';

class SoulBeyondReproach extends DrawCard {
    static id = 'soul-beyond-reproach';

    setupCardAbilities() {
        this.action({
            title: 'Honor a character, then honor it again',
            target: {
                cardType: CardType.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.honor(),
                    AbilityDsl.actions.honor()
                ])
            },
            effect: 'honor {0}, then honor it again'
        });
    }
}


export default SoulBeyondReproach;
