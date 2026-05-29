import DrawCard from '../../DrawCard.js';
import { Locations, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class DaidojiNerishma extends DrawCard {
    static id = 'daidoji-nerishma';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Flip a card faceup',
            target: {
                controller: Players.Self,
                location: Locations.Provinces,
                cardCondition: card => card.isDynasty && card.isFacedown(),
                gameAction: ability.actions.flipDynasty()
            }
        });
    }
}


export default DaidojiNerishma;
