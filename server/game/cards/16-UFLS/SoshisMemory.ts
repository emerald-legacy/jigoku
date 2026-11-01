import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';
import { deckSearch, moveCard } from '../../GameActions/GameActions.js';
import { Location, DeckType, Trait } from '../../Constants.js';
import { controlsShugenja } from '../controlsShugenja.js';
import { playerChoices } from '../playerChoices.js';

class SoshisMemory extends DrawCard {
    static id = 'soshi-s-memory';

    override setupCardAbilities() {
        this.action('Put a card into a player\'s hand')
            .condition((context) => controlsShugenja(context.player))
            .selectFrom({
                targets: true,
                activePromptTitle: 'Choose a player'
            }, (context) => playerChoices(context.player, (player) => this.drawAbility(player)))
            .chatText((context) => {
                const chosen = [context.player, context.player.opponent].find((player) => player?.name === context.select);
                const amount = Math.min(context.player.cardsInPlay.filter((card) => card.hasTrait(Trait.Shugenja)).length, chosen?.conflictDeck.length ?? 0);
                return msg`let ${context.select} look at the top ${amount} card${amount === 1 ? '' : 's'} of their conflict deck`;
            });
    }

    drawAbility(player: Player) {
        return deckSearch(() => ({
            target: player,
            activePromptTitle: 'Choose a card to put into your hand',
            reveal: false,
            cardsToLookAt: (context) => context.player.cardsInPlay.reduce((total: number, card) => total + (card.hasTrait(Trait.Shugenja) ? 1 : 0), 0),
            deck: DeckType.Conflict,
            gameAction: moveCard({
                destination: Location.Hand
            })
        }));
    }
}


export default SoshisMemory;
