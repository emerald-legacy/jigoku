import DrawCard from '../../drawcard.js';
import { CardTypes, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityContext } from '../../AbilityContext.js';

const conduitOfHeroesCost = function () {
    return {
        action: { name: 'conduitOfHeroesCost' },
        getActionName(_context: AbilityContext) {
            return 'conduitOfHeroesCost';
        },
        getCostMessage: function (context: AbilityContext) {
            if(context.player.opponent && context.player.honor >= context.player.opponent.honor + 5) {
                return undefined;
            }
            return ['bowing {0}'];
        },
        canPay: function (context: AbilityContext) {
            return context.player.opponent && context.player.honor >= context.player.opponent.honor + 5 ||
                context.game.actions.bow().canAffect(context.source, context);
        },
        resolve: function (context: AbilityContext) {
            context.costs.conduitOfHeroesCost = context.source;
            context.costs.skipConduitCost = context.player.opponent && context.player.honor >= context.player.opponent.honor + 5;
        },
        payEvent: function (context: AbilityContext) {
            if(!context.costs.skipConduitCost) {
                const events = [];

                const bowAction = context.game.actions.bow({ target: context.source });
                events.push(bowAction.getEvent(context.source, context));
                return events;
            }

            const action = context.game.actions.handler({ handler: () => true }); //this is a do-nothing event to allow you to "pay" a non-payment cost
            return action.getEvent(context.player, context);

        }
    };
};

class ConduitOfHeroes extends DrawCard {
    static id = 'conduit-of-heroes';

    setupCardAbilities() {
        this.action({
            title: 'Give a character +3/+1/+1',
            cost: conduitOfHeroesCost(),
            condition: () => this.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: (card, context) => card !== context.source,
                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                    effect: [
                        AbilityDsl.effects.modifyMilitarySkill(3),
                        AbilityDsl.effects.modifyPoliticalSkill(1),
                        AbilityDsl.effects.modifyGlory(1)
                    ]
                }))
            },
            effect: 'grant {0} +3{1}/+1{2}/+1{3} until the end of the conflict',
            effectArgs: ['military', 'political', 'glory']
        });
    }
}


export default ConduitOfHeroes;
