import { Players, CardType, AbilityType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { addTrait, gainAbility } from '../../effects.js';
import { moveToConflict, ready } from '../../GameActions/GameActions.js';

class TakeUpCommand extends DrawCard {
    static id = 'take-up-command';

    setupCardAbilities() {
        this.whileAttached({
            effect: [
                addTrait('commander'),
                gainAbility(AbilityType.Action, {
                    title: 'Ready character and move to conflict',
                    condition: (context) => context.source.isParticipating(),
                    target: {
                        cardType: CardType.Character,
                        controller: Players.Self,
                        cardCondition: card => card.hasTrait('bushi') && card.costLessThan(3),
                        gameAction: [ready(), moveToConflict()]
                    },
                    chatText: 'ready {0} and move it into the conflict'
                })
            ]
        });
    }
}


export default TakeUpCommand;
