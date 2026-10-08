import DrawCard from '../../DrawCard.js';
import { placeFateOnRing, takeFateFromRing } from '../../GameActions/GameActions.js';

class WrittenInTheStars extends DrawCard {
    static id = 'written-in-the-stars';

    setupCardAbilities() {
        this.action('Place or take fate from rings')
            .select({}, {
                'Place one fate on each unclaimed ring with no fate': placeFateOnRing(() => ({
                    target: Object.values(this.game.rings).filter((ring) => ring.isUnclaimed() && ring.fate === 0)
                })),
                'Remove one fate from each unclaimed ring': takeFateFromRing(() => ({
                    target: Object.values(this.game.rings).filter((ring) => ring.isUnclaimed() && ring.fate > 0),
                    removeOnly: true
                }))
            });
    }
}


export default WrittenInTheStars;
