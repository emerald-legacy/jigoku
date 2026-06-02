import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class SinisterSoshi extends DrawCard {
    static id = 'sinister-soshi';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Give a character -2/-2',

            target: {
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.cardLastingEffect({ effect: ability.effects.modifyBothSkills(-2) })
            },
            effect: 'give {0} -2{1}/-2{2}',
            effectArgs: () => ['military', 'political']
        });
    }
}


export default SinisterSoshi;
