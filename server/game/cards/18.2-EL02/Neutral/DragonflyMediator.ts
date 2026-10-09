import DrawCard from '../../../DrawCard.js';
import { Location, Players, TargetMode } from '../../../Constants.js';
import { reveal } from '../../../GameActions/GameActions.js';

class DragonflyMediator extends DrawCard {
    static id = 'dragonfly-mediator';

    setupCardAbilities() {
        this.action('Have each player reveal cards from their hand')
            .target({
                name: 'myCard',
                activePromptTitle: 'Choose a card to reveal',
                location: Location.Hand,
                controller: Players.Self
            }, reveal({ chatMessage: true }))
            .targetCards({
                name: 'oppCard',
                activePromptTitle: 'Choose three cards to reveal',
                mode: TargetMode.ExactlyVariable,
                numCardsFunc: (context) => Math.min(3, context.player.opponent?.hand.length ?? 0),
                player: Players.Opponent,
                location: Location.Hand,
                controller: Players.Opponent
            }, reveal((context) => ({ chatMessage: true, player: context.player.opponent })))
            .chatText('have each player reveal cards from their hand');
    }
}

export default DragonflyMediator;
