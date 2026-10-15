import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { CardType, Players } from '../../Constants.js';
import { modifyGlory, modifyMilitarySkill, modifyPoliticalSkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import * as costs from '../../costs/index.js';

class ConduitOfHeroes extends DrawCard {
    static id = 'conduit-of-heroes';

    override setupCardAbilities() {
        this.action('Give a character +3/+1/+1')
            .condition(() => this.game.isDuringConflict())
            .cost(costs.unless((context) => !!context.player.opponent && context.player.honor >= context.player.opponent.honor + 5, costs.bowSelf()))
            .target({
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card, context) => card !== context.source
            }, cardLastingEffect(() => ({
                effect: [
                    modifyMilitarySkill(3),
                    modifyPoliticalSkill(1),
                    modifyGlory(1)
                ]
            })))
            .chatText((context) => msg`grant ${context.chatTarget()} +3${'military'}/+1${'political'}/+1glory until the end of the conflict`);
    }
}


export default ConduitOfHeroes;
