import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class DispatchToNowhere extends DrawCard {
    static id = 'dispatch-to-nowhere';

    setupCardAbilities() {
        this.action('Discard a character with no fate')
            .target('target', {
                cardType: CardType.Character,
                cardCondition: card => card.getFate() === 0
            }, AbilityDsl.actions.discardFromPlay());
    }
}


export default DispatchToNowhere;
