import { Players, CardType, Trait } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { addTrait, gainAbility } from '../../effects.js';
import { moveToConflict, ready } from '../../GameActions/GameActions.js';
import { readyAndMoveMessage } from '../readyAndMoveMessage.js';

class TakeUpCommand extends DrawCard {
    static id = 'take-up-command';

    override setupCardAbilities() {
        this.whileAttached({
            effect: [
                addTrait(Trait.Commander),
                gainAbility.action('Ready character and move to conflict', (ability) => ability
                    .condition((context) => context.source.isParticipating())
                    .target({
                        cardType: CardType.Character,
                        controller: Players.Self,
                        cardCondition: (card) => card.hasTrait(Trait.Bushi) && card.costLessThan(3)
                    }, ready(), moveToConflict())
                    .chatText((context) => readyAndMoveMessage(context, context.target)))
            ]
        });
    }
}


export default TakeUpCommand;
