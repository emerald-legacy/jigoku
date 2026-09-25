import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class SinisterSoshi extends DrawCard {
    static id = 'sinister-soshi';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Give a character -2/-2')
            .target('target', {
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating()
            }, ability.actions.cardLastingEffect({ effect: ability.effects.modifyBothSkills(-2) }))
            .effect('give {0} -2{1}/-2{2}', () => ['military', 'political']);
    }
}


export default SinisterSoshi;
