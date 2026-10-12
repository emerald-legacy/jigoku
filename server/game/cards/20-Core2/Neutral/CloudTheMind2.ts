import { blank, loseGainedAbilities } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { controlsShugenja } from '../../controlsShugenja.js';
import type { PlayType } from '../../../Constants.js';

export default class CloudTheMind2 extends DrawCard {
    static id = 'cloud-the-mind-2';

    setupCardAbilities() {
        this.whileAttached({
            effect: blank()
        });

        this.whileAttached({
            condition: (context) => context.source.controller.hasAffinity('air', context),
            effect: loseGainedAbilities()
        });
    }

    public canPlay(context: AbilityContext, playType?: PlayType) {
        return controlsShugenja(context.player) && super.canPlay(context, playType);
    }
}
