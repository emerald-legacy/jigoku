import { CardType } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class LostDeedsTemple extends ProvinceCard {
    static id = 'lost-deeds-temple';

    setupCardAbilities() {
        this.action({
            title: 'Discard an attachment',
            target: {
                cardType: CardType.Attachment,
                cardCondition: (card) => card.parent?.type === CardType.Character && card.parent.isParticipating(),
                gameAction: AbilityDsl.actions.discardFromPlay()
            }
        });
    }
}
