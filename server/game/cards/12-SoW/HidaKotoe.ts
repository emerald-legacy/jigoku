import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';
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
                cardType: CardTypes.Attachment,
                gameAction: AbilityDsl.actions.discardFromPlay()
            }
        });
    }
}


export default HidaKotoe;
