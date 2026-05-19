import DrawCard from '../../../drawcard.js';
import { Locations, Players, TargetModes } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

class DragonflyMediator extends DrawCard {
    static id = 'dragonfly-mediator';

    setupCardAbilities() {
        this.action({
            title: 'Have each player reveal cards from their hand',
            targets: {
                myCard: {
                    activePromptTitle: 'Choose a card to reveal',
                    location: Locations.Hand,
                    controller: Players.Self,
                    gameAction: AbilityDsl.actions.reveal({ chatMessage: true })
                },
                oppCard: {
                    activePromptTitle: 'Choose three cards to reveal',
                    mode: TargetModes.ExactlyVariable,
                    numCardsFunc: context => Math.min(3, context.player.opponent.hand.length),
                    player: Players.Opponent,
                    location: Locations.Hand,
                    controller: Players.Opponent,
                    gameAction: AbilityDsl.actions.reveal(context => ({ chatMessage: true, player: context.player.opponent }))
                }
            },
            effect: 'have each player reveal cards from their hand'
        });
    }
}

export default DragonflyMediator;
