import DrawCard from '../../drawcard.js';

class LocalDaimyosRetainer extends DrawCard {
    static id = 'local-daimyo-s-retainer';

    canPlay(context, playType) {
        return context.player.getNumberOfFaceupProvinces() >= 3 && super.canPlay(context, playType);
    }
}


export default LocalDaimyosRetainer;
