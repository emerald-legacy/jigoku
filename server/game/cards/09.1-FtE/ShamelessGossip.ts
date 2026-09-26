import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, CardType } from '../../Constants.js';

class ShamelessGossip extends DrawCard {
    static id = 'shameless-gossip';

    setupCardAbilities() {
        this.action('Move a status token')
            .condition(context => context.source.isParticipating())
            .target('first', {
                activePromptTitle: 'Choose a Character to move a status token from',
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: card => card.isHonored || card.isDishonored || card.isTainted
            })
            .target('second', {
                activePromptTitle: 'Choose a Character to move the status token to',
                dependsOn: 'first',
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card.controller === context.targets.first.controller &&
                        card !== context.targets.first
            }, AbilityDsl.actions.selectToken(context => ({
                card: context.targets.first,
                activePromptTitle: 'Which token do you wish to move?',
                message: '{0} chooses to move {1}',
                messageArgs: (token, player) => [player, token],
                gameAction: AbilityDsl.actions.moveStatusToken(context => ({
                    recipient: context.targets.second as DrawCard
                }))
            })))
            .effect('move a status token from {1} to {2}', context => [context.targets.first, context.targets.second]);
    }
}


export default ShamelessGossip;

