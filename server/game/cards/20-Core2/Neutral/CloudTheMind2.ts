import { blank, cannotTriggerAbilities } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { controlsShugenja } from '../../controlsShugenja.js';

export default class CloudTheMind2 extends DrawCard {
    static id = 'cloud-the-mind-2';

    setupCardAbilities() {
        this.whileAttached({
            effect: blank()
        });

        this.whileAttached({
            condition: (context) => context.source.controller.hasAffinity('air', context),
            effect: cannotTriggerAbilities()
        });
    }

    public canPlay(context: AbilityContext, playType: string) {
        return controlsShugenja(context.player) && super.canPlay(context, playType);
    }
}
