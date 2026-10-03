import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class MasterOfJade extends DrawCard {
    static id = 'master-of-jade';

    setupCardAbilities() {
        this.action('Lose 2 honor to put a fate on a character')
            .cost(AbilityDsl.costs.payHonor(2))
            .target('target', {
                cardType: CardType.Character
            }, AbilityDsl.actions.placeFate({amount: 1}));
    }
}


export default MasterOfJade;
