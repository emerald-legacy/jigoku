import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class FestivalForTheFortunes extends DrawCard {
    static id = 'festival-for-the-fortunes';

    override setupCardAbilities() {
        this.action('Honor each character')
            .honor(() => ({
                target: this.game.findAnyCardsInPlay((card) => card.type === CardType.Character)
            }))
            .chatText('honor each character');
    }
}


export default FestivalForTheFortunes;
