import { CardType } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import { discardFromPlay } from '../../../GameActions/GameActions.js';

export default class LostDeedsTemple extends ProvinceCard {
    static id = 'lost-deeds-temple';

    setupCardAbilities() {
        this.action('Discard an attachment')
            .target({
                cardType: CardType.Attachment,
                cardCondition: (card) => !!card.parentCharacter?.isParticipating()
            }, discardFromPlay());
    }
}
