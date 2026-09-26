import { CardType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class IntoTheForbiddenCity extends ProvinceCard {
    static id = 'into-the-forbidden-city';

    setupCardAbilities() {
        this.action('Discard an attachment')
            .target('target', {
                cardType: CardType.Attachment,
                cardCondition: (card) => !!card.parentCharacter?.isAttacking()
            }, AbilityDsl.actions.discardFromPlay());
    }
}
