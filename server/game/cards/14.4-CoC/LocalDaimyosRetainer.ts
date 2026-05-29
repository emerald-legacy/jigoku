import DrawCard from '../../DrawCard.js';

class LocalDaimyosRetainer extends DrawCard {
    static id = 'local-daimyo-s-retainer';

    canPlay(context: any, playType: any) {
        return context.player.getNumberOfFaceupProvinces() >= 3 && super.canPlay(context, playType);
    }
}


export default LocalDaimyosRetainer;
