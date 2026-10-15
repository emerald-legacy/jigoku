import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { moveToConflict, selectCards, sendHome, sequential } from '../../GameActions/GameActions.js';
import { CardType, Players, TargetMode, Trait } from '../../Constants.js';

class WarriorsOfTheWind extends DrawCard {
    static id = 'warriors-of-the-wind';

    override setupCardAbilities() {
        this.action('Re-arrange participating cavalry characters')
            .gameAction(sequential([
                sendHome((context) => ({
                    target: context.player.filterCardsInPlay((card) => card.hasTrait(Trait.Cavalry) && card.isParticipating())
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
                    message: (_context, cards, player) => msg`${player} chooses to move ${cards} to the conflict`
                })
            ]));
    }
}


export default WarriorsOfTheWind;
