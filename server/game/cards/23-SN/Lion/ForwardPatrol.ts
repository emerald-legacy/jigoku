import { CardType, Trait } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { ready } from '../../../GameActions/GameActions.js';

export default class ForwardPatrol extends DrawCard {
    static id = 'forward-patrol';

    override setupCardAbilities() {
        this.conflictAction('Ready a character')
            .target({
                cardCondition: (card) => card.isParticipating() && card.hasTrait(Trait.Bushi),
                cardType: CardType.Character
            }, ready());
    }
}
