import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType } from '../../Constants.js';

class FestivalForTheFortunes extends DrawCard {
    static id = 'festival-for-the-fortunes';

    setupCardAbilities() {
        this.action({
            title: 'Honor each character',
            effect: 'honor each character',
            gameAction:
                AbilityDsl.actions.honor(() => ({
                    target: this.game.findAnyCardsInPlay(card => card.getType() === CardType.Character)
                }))
        });
    }
}


export default FestivalForTheFortunes;
