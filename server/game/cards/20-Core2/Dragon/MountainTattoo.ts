import { addTrait, cardCannot } from '../../../effects.js';
import { Phases } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class MountainTattoo extends DrawCard {
    static id = 'mountain-tattoo';

    setupCardAbilities() {
        this.attachmentConditions({ trait: 'monk' });

        this.whileAttached({ effect: addTrait('tattooed') });

        this.whileAttached({
            effect: cardCannot({
                cannot: 'target',
                restricts: 'opponentsEvents',
                source: this
            })
        });

        this.whileAttached({
            condition: (context) => context.game.currentPhase !== Phases.Fate,
            effect: cardCannot({
                cannot: 'ready',
                source: this
            })
        });
    }
}
