import DrawCard from '../../DrawCard.js';
import { moveStatusToken, selectToken } from '../../GameActions/GameActions.js';
import { Players, CardType } from '../../Constants.js';
import { msg } from '../../GameChat.js';

class ShamelessGossip extends DrawCard {
    static id = 'shameless-gossip';

    setupCardAbilities() {
        this.action('Move a status token')
            .condition((context) => context.source.isParticipating())
            .target({
                name: 'first',
                activePromptTitle: 'Choose a Character to move a status token from',
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.isHonored || card.isDishonored || card.isTainted
            })
            .target({
                name: 'second',
                activePromptTitle: 'Choose a Character to move the status token to',
                dependsOn: 'first',
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card.controller === context.targets.first.controller &&
                        card !== context.targets.first
            }, selectToken((context) => ({
                card: context.targets.first,
                activePromptTitle: 'Which token do you wish to move?',
                message: '{0} chooses to move {1}',
                messageArgs: (token, player) => [player, token],
                gameAction: moveStatusToken(() => ({
                    recipient: context.targets.second
                }))
            })))
            .chatText((context) => msg`move a status token from ${context.targets.first} to ${context.targets.second}`);
    }
}


export default ShamelessGossip;

