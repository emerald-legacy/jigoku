import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, CardTypes } from '../../Constants.js';

class BayushiAramoro extends DrawCard {
    static id = 'bayushi-aramoro';

    setupCardAbilities() {
        this.action({
            title: 'Give a character -2/-0',
            cost: AbilityDsl.costs.dishonorSelf(),
            condition: context => context.source.isParticipating() && this.game.currentConflict.conflictType === 'military',
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                    effect: [
                        AbilityDsl.effects.modifyMilitarySkill(-2),
                        AbilityDsl.effects.delayedEffect({
                            condition: () => context.target.getMilitarySkill() < 1,
                            message: '{0} is discarded due to {1}\'s lasting effect',
                            messageArgs: [context.target, context.source],
                            gameAction: AbilityDsl.actions.discardFromPlay()
                        })
                    ]
                }))
            },
            effect: 'reduce {0}\'s military skill by 2 - they will die if they reach 0'
        });
    }
}


export default BayushiAramoro;
