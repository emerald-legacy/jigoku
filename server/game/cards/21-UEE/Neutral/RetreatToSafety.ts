import AbilityDsl from '../../../abilitydsl';
import { CardTypes, Players, TargetModes } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class RetreatToSafety extends DrawCard {
    static id = 'retreat-to-safety';

    setupCardAbilities() {
        this.action({
            title: 'Move characters out of the conflict',
            target: {
                mode: TargetModes.UpTo,
                numCards: 2,
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.sendHome()
            },
            then: (parentContext) => ({
                gameAction: AbilityDsl.actions.conditional({
                    condition: (context) => context.player.isCharacterTraitInPlay('commander'),
                    falseGameAction: AbilityDsl.actions.noAction(),
                    trueGameAction: AbilityDsl.actions.selectCard({
                        activePromptTitle: 'Choose a character to ready',
                        player: Players.Self,
                        cardType: CardTypes.Character,
                        cardCondition: (card) => parentContext.target.includes(card),
                        gameAction: AbilityDsl.actions.ready(),
                        message: '{0} is readied due to {1}\'s superior leadership',
                        messageArgs: (card, player) => [card, player]
                    })
                })
            })
        });
    }
}
