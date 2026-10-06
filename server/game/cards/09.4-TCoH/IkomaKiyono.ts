import DrawCard from '../../DrawCard.js';
import { ready } from '../../GameActions/GameActions.js';

class IkomaKiyono extends DrawCard {
    static id = 'ikoma-kiyono';

    setupCardAbilities() {
        this.wouldInterrupt('Ready for Glory Count')
            .when({
                onGloryCount: (_event, context) => {
                    return context.player.isMoreHonorable();
                }
            })
            .gameAction(ready());
    }
}


export default IkomaKiyono;

