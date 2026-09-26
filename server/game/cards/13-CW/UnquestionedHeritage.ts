import type { ResolvedAbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class UnquestionedHeritage extends DrawCard {
    static id = 'unquestioned-heritage';

    setupCardAbilities() {
        this.action('Move an attachment')
            .condition(context => context.game.rings.air.isConsideredClaimed(context.player))
            .target('target', {
                cardType: CardType.Attachment,
                controller: Players.Any,
                cardCondition: (card, context) => Boolean(card.parentCharacter?.controller === context.player)
            }, AbilityDsl.actions.selectCard((context) => ({
                cardType: CardType.Character,
                cardCondition: card => card !== context.target.parentCharacter,
                message: '{0} moves {1} to {2}',
                messageArgs: card => [context.player, context.target, card],
                gameAction: AbilityDsl.actions.ifAble((context: ResolvedAbilityContext<DrawCard, DrawCard>) => ({
                    ifAbleAction: AbilityDsl.actions.attach({
                        attachment: context.target
                    }),
                    otherwiseAction: AbilityDsl.actions.discardFromPlay({ target: context.target })
                }))
            })))
            .effect('move {0} to another character');
    }
}


export default UnquestionedHeritage;
