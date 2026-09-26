import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class BayushiShoju extends DrawCard {
    static id = 'bayushi-shoju';

    setupCardAbilities() {
        this.action('Give a character -0/-1')
            .condition(context => context.source.isParticipating() && this.game.currentConflict?.conflictType === 'political')
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating()
            }, AbilityDsl.actions.cardLastingEffect((context) => ({
                effect: [
                    AbilityDsl.effects.modifyPoliticalSkill(-1),
                    AbilityDsl.effects.delayedEffect({
                        condition: () => context.target.getPoliticalSkill() < 1,
                        message: '{0} is discarded due to {1}\'s lasting effect',
                        messageArgs: [context.target, context.source],
                        gameAction: AbilityDsl.actions.discardFromPlay()
                    })
                ]
            })))
            .effect('reduce {0}\'s political skill by 1 - they will die if they reach 0')
            .limit(AbilityDsl.limit.perRound(2));
    }
}


export default BayushiShoju;
