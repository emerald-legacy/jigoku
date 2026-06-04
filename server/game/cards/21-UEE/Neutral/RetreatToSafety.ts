import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Players, TargetMode } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class RetreatToSafety extends DrawCard {
    static id = 'retreat-to-safety';

    setupCardAbilities() {
        this.action({
            title: 'Move characters out of the conflict',
            target: {
                mode: TargetMode.UpTo,
                numCards: 2,
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isDefending(),
                gameAction: AbilityDsl.actions.sendHome()
            },
            then: (parentContext) => ({
                gameAction: AbilityDsl.actions.conditional({
                    condition: (context) => context.player.isCharacterTraitInPlay('commander'),
                    falseGameAction: AbilityDsl.actions.noAction(),
                    trueGameAction: AbilityDsl.actions.selectCard({
                        activePromptTitle: 'Choose a character to ready',
                        player: Players.Self,
                        cardType: CardType.Character,
                        cardCondition: (card) => Array.isArray(parentContext.target) && parentContext.target.includes(card),
                        gameAction: AbilityDsl.actions.ready(),
                        message: '{0} is readied due to {1}\'s superior leadership',
                        messageArgs: (card, player) => [card, player]
                    })
                })
            })
        });
    }
}
