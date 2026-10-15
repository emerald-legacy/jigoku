import DrawCard from '../../DrawCard.js';

class LocalDaimyosRetainer extends DrawCard {
    static id = 'local-daimyo-s-retainer';

    override setupCardAbilities() {
        this.playOnlyIf((context) => context.player.getNumberOfFaceupProvinces() >= 3);
    }
}


export default LocalDaimyosRetainer;
