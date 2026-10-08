import { perRound } from '../../../AbilityLimit.js';
import {
    cardMenu,
    conditional,
    draw,
    lookAt,
    moveCard,
    sequentialContext
} from '../../../GameActions/GameActions.js';
import { Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { shuffle } from '../../../utils/random.js';
import { controlsShugenja } from '../../controlsShugenja.js';
import { msg } from '../../../GameChat.js';

export default class DrawingTheVoid extends DrawCard {
    static id = 'drawing-the-void';

    setupCardAbilities() {
        this.action('Gaze into the void')
            .condition((context) => controlsShugenja(context.player))
            .gameAction(sequentialContext((context) => {
                const revealedCards = shuffle(context.player.opponent?.hand ?? [])
                    .slice(0, 2)
                    .sort((a, b) => a.name.localeCompare(b.name));
                return {
                    gameActions: [
                        lookAt({
                            target: revealedCards,
                            message: (context, cards) => msg`${context.player.opponent} reveals ${cards} from their hand - the void reveals...`
                        }),
                        cardMenu((_context) => ({
                            activePromptTitle: 'Choose a card to remove from the game',
                            cards: revealedCards,
                            targets: true,
                            player: Players.Self,
                            message: (_context, card, player) => msg`${player} removes ${card} from the game - the void consumes`,
                            gameAction: moveCard({ destination: Location.RemovedFromGame })
                        })),
                        conditional((context) => ({
                            condition: context.player.hasAffinity('void', context),
                            trueGameAction: draw()
                        }))
                    ]
                };
            }))
            .chatText((context) => msg`reveal 2 random cards from ${context.player.opponent}'s hand and remove one from the game`)
            .max(perRound(1));
    }
}
