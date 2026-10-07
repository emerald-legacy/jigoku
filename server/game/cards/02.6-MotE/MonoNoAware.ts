import DrawCard from '../../DrawCard.js';
import { perRound } from '../../AbilityLimit.js';
import { draw, removeFate } from '../../GameActions/GameActions.js';

class MonoNoAware extends DrawCard {
    static id = 'mono-no-aware';

    setupCardAbilities() {
        this.action('Remove 1 fate from each character. Draw 1 card')
            .gameAction(draw(), removeFate(() => ({
                target: this.game.findAnyCardsInPlay(card => card.getFate() > 0)
            })))
            .effect('remove a fate from each character and draw a card')
            .max(perRound(1));
    }
}


export default MonoNoAware;
