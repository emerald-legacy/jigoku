import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class BentensTouch extends DrawCard {
    static id = 'benten-s-touch';

    setupCardAbilities() {
        this.action('Bow and Honor a character')
            .cost(AbilityDsl.costs.bow({
                cardType: CardType.Character,
                cardCondition: card => card.isFaction('phoenix') && card.hasTrait('shugenja')
            }))
            .target({
                cardType: CardType.Character,
                activePromptTitle: 'Choose a character to honor',
                controller: Players.Self,
                cardCondition: card => card.isParticipating()
            }, AbilityDsl.actions.honor());
    }
}


export default BentensTouch;
