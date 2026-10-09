import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type { PlayType } from '../../Constants.js';

class LocalDaimyosRetainer extends DrawCard {
    static id = 'local-daimyo-s-retainer';

    canPlay(context: AbilityContext, playType?: PlayType) {
        return context.player.getNumberOfFaceupProvinces() >= 3 && super.canPlay(context, playType);
    }
}


export default LocalDaimyosRetainer;
