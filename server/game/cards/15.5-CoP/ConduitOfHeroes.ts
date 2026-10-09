import { msg } from '../../GameChat.js';
import type BaseCard from '../../BaseCard.js';
import DrawCard from '../../DrawCard.js';
import { CardType, Players } from '../../Constants.js';
import { modifyGlory, modifyMilitarySkill, modifyPoliticalSkill } from '../../effects.js';
import { bow, cardLastingEffect, handler } from '../../GameActions/GameActions.js';
import type { Cost } from '../../costs/Cost.js';

function conduitOfHeroesCost(): Cost<{ conduitOfHeroesCost: BaseCard; skipConduitCost: boolean | undefined }> {
    return {
        getActionName(_context) {
            return 'conduitOfHeroesCost';
        },
        getCostMessage(context) {
            if(context.player.opponent && context.player.honor >= context.player.opponent.honor + 5) {
                return [];
            }
            return ['bowing {0}'];
        },
        canPay(context) {
            return context.player.opponent && context.player.honor >= context.player.opponent.honor + 5 ||
                bow().canAffect(context.source, context);
        },
        resolve(context) {
            context.costs.conduitOfHeroesCost = context.source;
            context.costs.skipConduitCost = context.player.opponent && context.player.honor >= context.player.opponent.honor + 5;
        },
        payEvent(context) {
            if(!context.costs.skipConduitCost) {
                const events = [];

                const bowAction = bow({ target: context.source });
                events.push(bowAction.getEvent(context.source, context));
                return events;
            }

            const action = handler({ handler: () => true }); //this is a do-nothing event to allow you to "pay" a non-payment cost
            return action.getEvent(context.player, context);

        }
    };
}

class ConduitOfHeroes extends DrawCard {
    static id = 'conduit-of-heroes';

    setupCardAbilities() {
        this.action('Give a character +3/+1/+1')
            .cost(conduitOfHeroesCost())
            .condition(() => this.game.isDuringConflict())
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
