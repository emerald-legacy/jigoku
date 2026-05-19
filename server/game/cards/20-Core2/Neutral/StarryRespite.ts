import { CardTypes } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class StarryRespite extends ProvinceCard {
    static id = 'starry-respite';

    public setupCardAbilities() {
        this.action({
            title: 'Honor a character',
            effect: 'honor {0}',
            target: {
                activePromptTitle: 'Choose a character to honor',
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }
}
