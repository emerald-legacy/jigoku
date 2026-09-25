import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';

class IuchiRimei extends DrawCard {
    static id = 'iuchi-rimei';

    setupCardAbilities() {
        this.action('Move an attachment')
            .target('target', {
                cardType: CardType.Attachment,
                controller: Players.Opponent,
                cardCondition: card => Boolean(card.costLessThan(2) && card.parentCharacter)
            }, AbilityDsl.actions.selectCard(context => ({
                cardCondition: card => card !== context.target?.parentCharacter && card.controller === context.target?.parentCharacter?.controller && card.type === CardType.Character,
                message: '{0} moves {1} to {2}',
                messageArgs: card => [context.player, context.target, card],
                gameAction: AbilityDsl.actions.ifAble((context: AbilityContext<DrawCard, DrawCard>) => ({
                    ifAbleAction: AbilityDsl.actions.attach({
                        attachment: context.target,
                        ignoreUniqueness: true
                    }),
                    otherwiseAction: AbilityDsl.actions.discardFromPlay({ target: context.target })
                }))
            })))
            .effect('move {0} to another character');
    }
}


export default IuchiRimei;
