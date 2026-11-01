import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { moveToConflict, selectCards, sendHome, sequential } from '../../GameActions/GameActions.js';
import { CardType, Players, TargetMode, Trait } from '../../Constants.js';
import type Player from '../../Player.js';

function participatingCavalry(player: Player) {
    return player.filterCardsInPlay((card) => card.hasTrait(Trait.Cavalry) && card.isParticipating());
}

class WarriorsOfTheWind extends DrawCard {
    static id = 'warriors-of-the-wind';

    override setupCardAbilities() {
        this.action('Re-arrange participating cavalry characters')
            .gameAction(sequential([
                sendHome((context) => ({
                    target: participatingCavalry(context.player)
                })),
                selectCards({
                    activePromptTitle: 'Choose characters',
                    mode: TargetMode.Unlimited,
                    optional: true,
                    cardType: CardType.Character,
                    controller: Players.Self,
                    targets: true,
                    cardCondition: (card) => card.hasTrait(Trait.Cavalry),
                    gameAction: moveToConflict(),
                    message: (_context, cards, player) => msg`${player} chooses to move ${cards.length === 0 ? 'no characters' : cards} to the conflict`
                })
            ]))
            .chatText((context) => {
                const participating = participatingCavalry(context.player);
                return participating.length > 0
                    ? msg`send ${participating} home and move any number of their Cavalry characters to the conflict`
                    : msg`move any number of their Cavalry characters to the conflict`;
            });
    }
}


export default WarriorsOfTheWind;
