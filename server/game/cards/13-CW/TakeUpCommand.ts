import { Players, CardType, AbilityType } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class TakeUpCommand extends DrawCard {
    static id = 'take-up-command';

    setupCardAbilities() {
        this.whileAttached({
            effect: [
                AbilityDsl.effects.addTrait('commander'),
                AbilityDsl.effects.gainAbility(AbilityType.Action, {
                    title: 'Ready character and move to conflict',
                    condition: (context: AbilityContext) => context.source.isParticipating(),
                    target: {
                        cardType: CardType.Character,
                        controller: Players.Self,
                        cardCondition: (card: any) => card.hasTrait('bushi') && card.costLessThan(3),
                        gameAction: [AbilityDsl.actions.ready(), AbilityDsl.actions.moveToConflict()]
                    },
                    effect: 'ready {0} and move it into the conflict'
                })
            ]
        });
    }
}


export default TakeUpCommand;
