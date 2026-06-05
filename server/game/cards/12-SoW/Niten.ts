import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { Players, CardType, Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import type { Cost } from '../../costs/Cost.js';

const nitenCaptureParentCost = function(): Cost {
    return {
        canPay: function() {
            return true;
        },
        resolve: function(context: AbilityContext) {
            context.costs.nitenCaptureParentCost = (context.source as DrawCard).parent;
        },
        pay: function() {
        }
    };

};

class Niten extends DrawCard {
    static id = 'niten';

    setupCardAbilities() {
        this.attachmentConditions({
            faction: 'dragon'
        });

        this.action({
            title: 'Put an attachment into play',
            condition: context => !!(context.source.parent && context.source.parent.isParticipating()),
            cost: [
                nitenCaptureParentCost(),
                AbilityDsl.costs.returnSelfToHand()
            ],
            target: {
                cardType: CardType.Attachment,
                controller: Players.Self,
                location: Location.Hand,
                cardCondition: (card, context) => card.canAttach(context.source.parent) || card.canAttach(context.costs.nitenCaptureParentCost)
            },
            gameAction: AbilityDsl.actions.attach(context => ({
                target: context.costs.nitenCaptureParentCost,
                attachment: context.target
            })),
            max: AbilityDsl.limit.perRound(1)
        });
    }
}


export default Niten;
