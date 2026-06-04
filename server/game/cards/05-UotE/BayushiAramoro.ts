import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, CardType } from '../../Constants.js';

class BayushiAramoro extends DrawCard {
    static id = 'bayushi-aramoro';

    setupCardAbilities() {
        this.action({
            title: 'Give a character -2/-0',
            cost: AbilityDsl.costs.dishonorSelf(),
            condition: (context: AbilityContext) => (context.source as DrawCard).isParticipating() && this.game.currentConflict?.conflictType === 'military',
            target: {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card: any) => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect((context: AbilityContext) => ({
                    effect: [
                        AbilityDsl.effects.modifyMilitarySkill(-2),
                        AbilityDsl.effects.delayedEffect({
                            condition: () => (context.target as DrawCard).getMilitarySkill() < 1,
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
