import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class HidaKotoe extends DrawCard {
    static id = 'hida-kotoe';

    setupCardAbilities() {
        this.reaction('Discard an attachment')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.source.controller && context.source.isDefending()
            })
            .target('target', {
                cardType: CardType.Attachment
            }, AbilityDsl.actions.discardFromPlay());
    }
}


export default HidaKotoe;
