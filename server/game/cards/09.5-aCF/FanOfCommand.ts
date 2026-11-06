import DrawCard from '../../DrawCard.js';
import { CardType, Trait } from '../../Constants.js';
import { ready } from '../../GameActions/GameActions.js';

class FanOfCommand extends DrawCard {
    static id = 'fan-of-command';

    override setupCardAbilities() {
        this.action('Ready a character')
            .condition((context) => !!(context.source.parentCharacter && context.source.parentCharacter.isParticipating()))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating() && card.hasTrait(Trait.Bushi)
            }, ready());
    }
}


export default FanOfCommand;
