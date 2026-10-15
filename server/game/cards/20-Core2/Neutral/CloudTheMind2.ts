import { blank, loseGainedAbilities } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';
import { controlsShugenja } from '../../controlsShugenja.js';

export default class CloudTheMind2 extends DrawCard {
    static id = 'cloud-the-mind-2';

    setupCardAbilities() {
        this.playOnlyIf((context) => controlsShugenja(context.player));

        this.whileAttached({
            effect: blank()
        });

        this.whileAttached({
            condition: (context) => context.source.controller.hasAffinity('air', context),
            effect: loseGainedAbilities()
        });
    }
}
