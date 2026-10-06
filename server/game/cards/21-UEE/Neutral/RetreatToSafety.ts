import { conditional, noAction, ready, selectCard, sendHome } from '../../../GameActions/GameActions.js';
import { CardType, Players, TargetMode } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class RetreatToSafety extends DrawCard {
    static id = 'retreat-to-safety';

    setupCardAbilities() {
        this.action('Move characters out of the conflict')
            .targetCards({
                mode: TargetMode.UpTo,
                numCards: 2,
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isDefending()
            }, sendHome())
            .then()
            .gameAction(conditional((context) => ({
                condition: context.player.isCharacterTraitInPlay('commander'),
                falseGameAction: noAction(),
                trueGameAction: selectCard({
                    activePromptTitle: 'Choose a character to ready',
                    player: Players.Self,
                    cardType: CardType.Character,
                    cardCondition: (card) => context.targets.target.includes(card),
                    gameAction: ready(),
                    message: '{0} is readied due to {1}\'s superior leadership',
                    messageArgs: (card, player) => [card, player]
                })
            })));
    }
}
