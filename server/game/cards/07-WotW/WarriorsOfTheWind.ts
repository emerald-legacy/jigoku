import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, Players, TargetModes } from '../../Constants.js';

class WarriorsOfTheWind extends DrawCard {
    static id = 'warriors-of-the-wind';

    setupCardAbilities() {
        this.action({
            title: 'Re-arrange participating cavalry characters',
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.sendHome((context: any) => ({
                    target: context.player.filterCardsInPlay((card: any) => card.hasTrait('cavalry') && card.isParticipating())
                })),
                AbilityDsl.actions.selectCard({
                    activePromptTitle: 'Choose characters',
                    mode: TargetModes.Unlimited,
                    optional: true,
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    targets: true,
                    cardCondition: (card: any) => card.hasTrait('cavalry'),
                    gameAction: AbilityDsl.actions.moveToConflict(),
                    message: '{0} chooses to move {1} to the conflict',
                    messageArgs: (cards: any, player: any) => [player, cards]
                })
            ])
        });
    }
}


export default WarriorsOfTheWind;
