import DrawCard from '../../DrawCard.js';
import { Players, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class IuchiRimei extends DrawCard {
    static id = 'iuchi-rimei';

    setupCardAbilities() {
        this.action({
            title: 'Move an attachment',
            target: {
                cardType: CardTypes.Attachment,
                controller: Players.Opponent,
                cardCondition: card => card.costLessThan(2) && card.parent && card.parent.type === CardTypes.Character,
                gameAction: AbilityDsl.actions.selectCard(context => ({
                    cardCondition: card => card !== context.target.parent && card.controller === context.target.parent.controller && card.type === CardTypes.Character,
                    message: '{0} moves {1} to {2}',
                    messageArgs: card => [context.player, context.target, card],
                    gameAction: AbilityDsl.actions.ifAble(context => ({
                        ifAbleAction: AbilityDsl.actions.attach({
                            attachment: context.target,
                            ignoreUniqueness: true
                        }),
                        otherwiseAction: AbilityDsl.actions.discardFromPlay({ target: context.target })
                    }))
                }))
            },
            effect: 'move {0} to another character'
        });
    }
}


export default IuchiRimei;
