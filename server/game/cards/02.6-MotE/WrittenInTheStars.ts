import DrawCard from '../../DrawCard.js';
import { TargetModes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class WrittenInTheStars extends DrawCard {
    static id = 'written-in-the-stars';

    setupCardAbilities() {
        this.action({
            title: 'Place or take fate from rings',
            target: {
                mode: TargetModes.Select,
                choices: {
                    'Place one fate on each unclaimed ring with no fate': AbilityDsl.actions.placeFateOnRing(() => ({
                        target: Object.values(this.game.rings).filter(ring => ring.isUnclaimed() && ring.fate === 0)
                    })),
                    'Remove one fate from each unclaimed ring': AbilityDsl.actions.takeFateFromRing(() => ({
                        target: Object.values(this.game.rings).filter(ring => ring.isUnclaimed() && ring.fate > 0),
                        removeOnly: true
                    }))
                }
            }
        });
    }
}


export default WrittenInTheStars;
