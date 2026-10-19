import { perRound } from '../../../AbilityLimit.js';
import {
    cardMenu,
    conditional,
    draw,
    lookAt,
    moveCard,
    sequential
} from '../../../GameActions/GameActions.js';
import { Location, Players, Trait } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { controlsShugenja } from '../../controlsShugenja.js';
import { msg } from '../../../GameChat.js';
import { randomHandCards } from '../../randomHandCards.js';

export default class DrawingTheVoid extends DrawCard {
    static id = 'drawing-the-void';

    override setupCardAbilities() {
        this.action('Gaze into the void')
            .ifCondition((context) => controlsShugenja(context.player))
            .gameAction(sequential((context) => {
                const revealedCards = randomHandCards(context.player.opponent, 2);
                return [
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
                        condition: context.player.hasAffinity(Trait.Void, context),
                        trueGameAction: draw()
                    }))
                ];
            }))
            .chatText((context) => msg`reveal 2 random cards from ${context.player.opponent}'s hand and remove one from the game`)
            .max(perRound(1));
    }
}
