import { CardType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { discardFromPlay } from '../../GameActions/GameActions.js';

export default class IntoTheForbiddenCity extends ProvinceCard {
    static id = 'into-the-forbidden-city';

    setupCardAbilities() {
        this.action('Discard an attachment')
            .target({
                cardType: CardType.Attachment,
                cardCondition: (card) => !!card.parentCharacter?.isAttacking()
            }, discardFromPlay());
    }
}
