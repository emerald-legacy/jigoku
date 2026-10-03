import { CardType } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class LostDeedsTemple extends ProvinceCard {
    static id = 'lost-deeds-temple';

    setupCardAbilities() {
        this.action('Discard an attachment')
            .target('target', {
                cardType: CardType.Attachment,
                cardCondition: (card) => !!card.parentCharacter?.isParticipating()
            }, AbilityDsl.actions.discardFromPlay());
    }
}
