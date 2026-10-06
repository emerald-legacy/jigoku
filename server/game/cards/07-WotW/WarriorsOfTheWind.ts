import DrawCard from '../../DrawCard.js';
import { moveToConflict, selectCards, sendHome, sequential } from '../../GameActions/GameActions.js';
import { CardType, Players, TargetMode } from '../../Constants.js';

class WarriorsOfTheWind extends DrawCard {
    static id = 'warriors-of-the-wind';

    setupCardAbilities() {
        this.action('Re-arrange participating cavalry characters')
            .gameAction(sequential([
                sendHome((context) => ({
                    target: context.player.filterCardsInPlay((card) => card.hasTrait('cavalry') && card.isParticipating())
                })),
                selectCards({
                    activePromptTitle: 'Choose characters',
                    mode: TargetMode.Unlimited,
                    optional: true,
                    cardType: CardType.Character,
                    controller: Players.Self,
                    targets: true,
                    cardCondition: (card) => card.hasTrait('cavalry'),
                    gameAction: moveToConflict(),
                    message: '{0} chooses to move {1} to the conflict',
                    messageArgs: (cards, player) => [player, cards]
                })
            ]));
    }
}


export default WarriorsOfTheWind;
