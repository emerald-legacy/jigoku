import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Players, TargetMode } from '../../Constants.js';

class WarriorsOfTheWind extends DrawCard {
    static id = 'warriors-of-the-wind';

    setupCardAbilities() {
        this.action({
            title: 'Re-arrange participating cavalry characters',
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.sendHome((context: AbilityContext) => ({
                    target: context.player.filterCardsInPlay((card) => card.hasTrait('cavalry') && card.isParticipating())
                })),
                AbilityDsl.actions.selectCard({
                    activePromptTitle: 'Choose characters',
                    mode: TargetMode.Unlimited,
                    optional: true,
                    cardType: CardType.Character,
                    controller: Players.Self,
                    targets: true,
                    cardCondition: (card) => card.hasTrait('cavalry'),
                    gameAction: AbilityDsl.actions.moveToConflict(),
                    message: '{0} chooses to move {1} to the conflict',
                    messageArgs: (cards, player) => [player, cards]
                })
            ])
        });
    }
}


export default WarriorsOfTheWind;
