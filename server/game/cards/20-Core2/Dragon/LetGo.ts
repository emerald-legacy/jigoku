import { CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class LetGo extends DrawCard {
    static id = 'let-go';

    setupCardAbilities() {
        this.action('Discard an attachment')
            .target('target', {
                cardType: CardType.Attachment
            }, AbilityDsl.actions.discardFromPlay());
    }
}
