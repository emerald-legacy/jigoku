import DrawCard from '../../DrawCard.js';
import { Players, CardType, ConflictType } from '../../Constants.js';
import { perRound } from '../../AbilityLimit.js';
import { delayedEffect, modifyPoliticalSkill } from '../../effects.js';
import { cardLastingEffect, discardFromPlay } from '../../GameActions/GameActions.js';

class BayushiShoju extends DrawCard {
    static id = 'bayushi-shoju';

    setupCardAbilities() {
        this.action('Give a character -0/-1')
            .condition((context) => context.source.isParticipating() && this.game.isDuringConflict(ConflictType.Political))
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, cardLastingEffect((context) => ({
                effect: [
                    modifyPoliticalSkill(-1),
                    delayedEffect({
                        condition: () => context.target.politicalSkill < 1,
                        message: '{0} is discarded due to {1}\'s lasting effect',
                        messageArgs: [context.target, context.source],
                        gameAction: discardFromPlay()
                    })
                ]
            })))
            .chatText('reduce {0}\'s political skill by 1 - they will die if they reach 0')
            .limit(perRound(2));
    }
}


export default BayushiShoju;
