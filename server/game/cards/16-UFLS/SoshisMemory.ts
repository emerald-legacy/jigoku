import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location, Decks } from '../../Constants.js';
import { controlsShugenja } from '../controlsShugenja.js';
import { playerChoices } from '../playerChoices.js';

class SoshisMemory extends DrawCard {
    static id = 'soshi-s-memory';

    setupCardAbilities() {
        this.action('Put a card into a player\'s hand')
            .condition(context => controlsShugenja(context.player))
            .selectFrom({
                targets: true,
                activePromptTitle: 'Choose a player'
            }, (context) => playerChoices(context.player, (player) => this.drawAbility(player)))
            .effect('let {1} look at the top {2} cards of their conflict deck', context => [context.select, context.player.cardsInPlay.reduce((total: number, card) => total + (card.hasTrait('shugenja') ? 1 : 0), 0)]);
    }

    drawAbility(player: Player) {
        return AbilityDsl.actions.deckSearch(() => ({
            player: player,
            activePromptTitle: 'Choose a card to put into your hand',
            reveal: false,
            amount: (context) => context.player.cardsInPlay.reduce((total: number, card) => total + (card.hasTrait('shugenja') ? 1 : 0), 0),
            deck: Decks.ConflictDeck,
            gameAction: AbilityDsl.actions.moveCard({
                destination: Location.Hand
            })
        }));
    }
}


export default SoshisMemory;
