import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';
import { deckSearch, moveCard } from '../../GameActions/GameActions.js';
import { Location, DeckType } from '../../Constants.js';
import { controlsShugenja } from '../controlsShugenja.js';
import { playerChoices } from '../playerChoices.js';

class SoshisMemory extends DrawCard {
    static id = 'soshi-s-memory';

    setupCardAbilities() {
        this.action('Put a card into a player\'s hand')
            .condition((context) => controlsShugenja(context.player))
            .selectFrom({
                targets: true,
                activePromptTitle: 'Choose a player'
            }, (context) => playerChoices(context.player, (player) => this.drawAbility(player)))
            .chatText((context) => msg`let ${context.select} look at the top ${context.player.cardsInPlay.reduce((total: number, card) => total + (card.hasTrait('shugenja') ? 1 : 0), 0)} cards of their conflict deck`);
    }

    drawAbility(player: Player) {
        return deckSearch(() => ({
            player: player,
            activePromptTitle: 'Choose a card to put into your hand',
            reveal: false,
            cardsToLookAt: (context) => context.player.cardsInPlay.reduce((total: number, card) => total + (card.hasTrait('shugenja') ? 1 : 0), 0),
            deck: DeckType.Conflict,
            gameAction: moveCard({
                destination: Location.Hand
            })
        }));
    }
}


export default SoshisMemory;
