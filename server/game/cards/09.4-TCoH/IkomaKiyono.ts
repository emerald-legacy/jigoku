import DrawCard from '../../DrawCard.js';

class IkomaKiyono extends DrawCard {
    static id = 'ikoma-kiyono';

    setupCardAbilities() {
        this.wouldInterrupt('Ready for Glory Count')
            .when({
                onGloryCount: (_event, context) => {
                    return context.player.isMoreHonorable();
                }
            })
            .ready();
    }
}


export default IkomaKiyono;

