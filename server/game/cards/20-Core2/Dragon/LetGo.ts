import { CardTypes } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class LetGo extends DrawCard {
    static id = 'let-go';

    setupCardAbilities() {
        this.action({
            title: 'Discard an attachment',
            target: {
                cardType: CardTypes.Attachment,
                gameAction: AbilityDsl.actions.discardFromPlay()
            }
        });
    }
}
