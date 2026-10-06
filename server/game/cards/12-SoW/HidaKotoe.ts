import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { discardFromPlay } from '../../GameActions/GameActions.js';

class HidaKotoe extends DrawCard {
    static id = 'hida-kotoe';

    setupCardAbilities() {
        this.reaction('Discard an attachment')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.source.controller && context.source.isDefending()
            })
            .target({
                cardType: CardType.Attachment
            }, discardFromPlay());
    }
}


export default HidaKotoe;
