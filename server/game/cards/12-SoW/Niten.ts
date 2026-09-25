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
            context.costs.nitenCaptureParentCost = (context.source as DrawCard).parentCharacter;
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

        this.action('Put an attachment into play')
            .cost(nitenCaptureParentCost())
            .cost(AbilityDsl.costs.returnSelfToHand())
            .condition(context => !!(context.source.parentCharacter && context.source.parentCharacter.isParticipating()))
            .target('target', {
                cardType: CardType.Attachment,
                controller: Players.Self,
                location: Location.Hand,
                cardCondition: (card, context) => card.canAttach(context.source.parentCharacter ?? undefined) || card.canAttach(context.costs.nitenCaptureParentCost as DrawCard)
            })
            .gameAction(AbilityDsl.actions.attach((context) => ({
                target: context.costs.nitenCaptureParentCost as DrawCard,
                attachment: context.target
            })))
            .max(AbilityDsl.limit.perRound(1));
    }
}


export default Niten;
