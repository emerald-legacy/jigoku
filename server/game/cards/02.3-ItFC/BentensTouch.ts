import DrawCard from '../../drawcard.js';
import { Players, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class BentensTouch extends DrawCard {
    static id = 'benten-s-touch';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Bow and Honor a character',

            cost: ability.costs.bow({
                cardType: CardTypes.Character,
                cardCondition: card => card.isFaction('phoenix') && card.hasTrait('shugenja')
            }),
            target: {
                cardType: CardTypes.Character,
                activePromptTitle: 'Choose a character to honor',
                controller: Players.Self,
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.honor()
            }
        });
    }
}


export default BentensTouch;
