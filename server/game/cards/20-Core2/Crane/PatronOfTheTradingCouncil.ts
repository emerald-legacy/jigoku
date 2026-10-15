import { msg } from '../../../GameChat.js';
import { Location, Players, RemainingCards, TargetMode, Trait } from '../../../Constants.js';
import { modifyBothSkills } from '../../../effects.js';
import { deckSearch, lookAt, moveCard, sequential } from '../../../GameActions/GameActions.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import type Player from '../../../Player.js';
import type { DeckSearchProperties } from '../../../GameActions/DeckSearchAction.js';
import DrawCard from '../../../DrawCard.js';

// the chooser puts 1 of the top 2 cards of that player's deck into its owner's hand, the other on the bottom
function giveOneCard(player: Player | undefined, activePromptTitle: string): DeckSearchProperties {
    return {
        target: player,
        player: Players.Self,
        activePromptTitle,
        cardsToLookAt: player ? 2 : 0,
        mode: TargetMode.Exactly,
        numCards: 1,
        reveal: false,
        remainingCards: RemainingCards.BottomRandom,
        message: (_context: AbilityContext, cards: DrawCard[], chooser: Player) => msg`${chooser} chooses ${cards} to give to ${player}`,
        gameAction: moveCard({ destination: Location.Hand })
    };
}

export default class PatronOfTheTradingCouncil extends DrawCard {
    static id = 'patron-of-the-trading-council';

    override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) =>
                (context.game.currentConflict?.getNumberOfParticipants((card) =>
                    card.hasTrait(Trait.MantisClan)
                ) ?? 0) > 0,
            effect: modifyBothSkills(1)
        });

        this.action('Give each player a valuable good')
            .gameAction(sequential([
                lookAt((context) => ({
                    target: context.player.conflictDeck.slice(0, 2),
                    message: (context, cards) => msg`${context.player} reveals the top ${cards.length} from their conflict deck: ${cards}`
                })),
                lookAt((context) => ({
                    target: context.player.opponent ? context.player.opponent.conflictDeck.slice(0, 2) : [],
                    message: (context, cards) => msg`${context.player.opponent} reveals the top ${cards.length} from their conflict deck: ${cards}`
                })),
                deckSearch((context) => giveOneCard(context.player, 'Choose a card to give to yourself')),
                deckSearch((context) => giveOneCard(context.player.opponent, 'Choose a card to give your opponent'))
            ]))
            .chatText('give each player a valuable good');
    }
}
