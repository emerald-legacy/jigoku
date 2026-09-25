import { CardType } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class StarryRespite extends ProvinceCard {
    static id = 'starry-respite';

    public setupCardAbilities() {
        this.action('Honor a character')
            .target('target', {
                activePromptTitle: 'Choose a character to honor',
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, AbilityDsl.actions.honor())
            .effect('honor {0}');
    }
}
