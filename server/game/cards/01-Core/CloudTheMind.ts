import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { blank } from '../../effects.js';
import { controlsShugenja } from '../controlsShugenja.js';

class CloudTheMind extends DrawCard {
    static id = 'cloud-the-mind';

    setupCardAbilities() {
        this.whileAttached({
            effect: blank()
        });
    }

    canPlay(context: AbilityContext, playType: string) {
        return controlsShugenja(context.player) && super.canPlay(context, playType);
    }
}


export default CloudTheMind;


