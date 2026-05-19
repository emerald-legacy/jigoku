import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class SinisterSoshi extends DrawCard {
    static id = 'sinister-soshi';

    setupCardAbilities(ability) {
        this.action({
            title: 'Give a character -2/-2',

            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.cardLastingEffect({ effect: ability.effects.modifyBothSkills(-2) })
            },
            effect: 'give {0} -2{1}/-2{2}',
            effectArgs: () => ['military', 'political']
        });
    }
}


export default SinisterSoshi;
