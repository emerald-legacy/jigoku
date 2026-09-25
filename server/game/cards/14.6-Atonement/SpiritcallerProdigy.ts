import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Location, Players } from '../../Constants.js';

class SpiritcallerProdigy extends DrawCard {
    static id = 'spiritcaller-prodigy';

    setupCardAbilities() {
        this.action('Resurrect a character')
            .cost(AbilityDsl.costs.sacrificeSelf())
            .target('target', {
                activePromptTitle: 'Choose a character from your dynasty discard pile',
                location: [Location.DynastyDiscardPile],
                cardType: CardType.Character,
                cardCondition: card => card.isFaction('lion') && card.costLessThan(4),
                controller: Players.Self
            }, AbilityDsl.actions.putIntoPlay())
            .effect('call {0} back from the dead');
    }
}


export default SpiritcallerProdigy;
