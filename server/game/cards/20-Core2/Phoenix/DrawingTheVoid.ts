import AbilityDsl from '../../../abilitydsl.js';
import {
    cardMenu,
    conditional,
    draw,
    lookAt,
    moveCard,
    noAction,
    sequentialContext
} from '../../../GameActions/GameActions.js';
import { Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { shuffle } from '../../../utils/shuffle.js';
import { controlsShugenja } from '../../controlsShugenja.js';

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
                        lookAt((context) => ({
                            target: revealedCards,
                            message: '{0} reveals {1} from their hand - the void reveals...',
                            messageArgs: (cards) => [context.player.opponent, cards]
                        })),
                        cardMenu((_context) => ({
                            activePromptTitle: 'Choose a card to remove from the game',
                            cards: revealedCards,
                            targets: true,
                            player: Players.Self,
                            message: '{0} removes {1} from the game - the void consumes',
                            messageArgs: (card, player) => [player, card],
                            gameAction: moveCard({ destination: Location.RemovedFromGame })
                        })),
                        conditional((context) => ({
                            condition: context.player.hasAffinity('void', context),
                            trueGameAction: draw(),
                            falseGameAction: noAction()
                        }))
                    ]
                };
            }))
            .max(AbilityDsl.limit.perRound(1));
    }
}
