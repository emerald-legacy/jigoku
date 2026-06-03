import { CardType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class IntoTheForbiddenCity extends ProvinceCard {
    static id = 'into-the-forbidden-city';

    setupCardAbilities() {
        this.action({
            title: 'Discard an attachment',
            target: {
                cardType: CardType.Attachment,
                cardCondition: (card) => card.parent?.type === CardType.Character && card.parent.isAttacking(),
                gameAction: AbilityDsl.actions.discardFromPlay()
            }
        });
    }
}
