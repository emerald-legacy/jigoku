import { CardType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class MeditationsOnTheTao extends ProvinceCard {
    static id = 'meditations-on-the-tao';
    setupCardAbilities() {
        this.action('Remove a fate from a character')
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card) => card.isAttacking()
            }, AbilityDsl.actions.removeFate());
    }
}
