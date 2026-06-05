import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';

class LocalDaimyosRetainer extends DrawCard {
    static id = 'local-daimyo-s-retainer';

    canPlay(context: AbilityContext, playType: string = 'play') {
        return context.player.getNumberOfFaceupProvinces() >= 3 && super.canPlay(context, playType);
    }
}


export default LocalDaimyosRetainer;
