import DrawCard from '../../DrawCard.js';
import { honor } from '../../GameActions/GameActions.js';
import { CardType } from '../../Constants.js';

class FestivalForTheFortunes extends DrawCard {
    static id = 'festival-for-the-fortunes';

    setupCardAbilities() {
        this.action('Honor each character')
            .gameAction(honor(() => ({
                target: this.game.findAnyCardsInPlay(card => card.getType() === CardType.Character)
            })))
            .effect('honor each character');
    }
}


export default FestivalForTheFortunes;
