import { CardType } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import { honor } from '../../../GameActions/GameActions.js';

export default class StarryRespite extends ProvinceCard {
    static id = 'starry-respite';

    public setupCardAbilities() {
        this.action('Honor a character')
            .target({
                activePromptTitle: 'Choose a character to honor',
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, honor())
            .chatText('honor {0}');
    }
}
