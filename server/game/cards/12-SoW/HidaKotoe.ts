import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class HidaKotoe extends DrawCard {
    static id = 'hida-kotoe';

    setupCardAbilities() {
        this.reaction({
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.source.controller && context.source.isDefending()
            },
            title: 'Discard an attachment',
            target: {
                cardType: CardType.Attachment,
                gameAction: AbilityDsl.actions.discardFromPlay()
            }
        });
    }
}


export default HidaKotoe;
