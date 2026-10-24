import { msg } from '../../../GameChat.js';
import { ready, sendHome } from '../../../GameActions/GameActions.js';
import { CardType, Players, TargetMode, Trait } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class RetreatToSafety extends DrawCard {
    static id = 'retreat-to-safety';

    override setupCardAbilities() {
        this.conflictAction('Move characters out of the conflict')
            .targetCards({
                mode: TargetMode.UpTo,
                numCards: 2,
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isDefending()
            }, sendHome())
            .afterwards()
            .if((context) => context.player.isCharacterTraitInPlay(Trait.Commander))
                .selectCard((context) => ({
                    activePromptTitle: 'Choose a character to ready',
                    optional: true,
                    player: Players.Self,
                    cardType: CardType.Character,
                    cardCondition: (card) => context.targets.target.some((target) => target === card),
                    gameAction: ready(),
                    message: (_context, card, player) => msg`${card} is readied due to ${player}'s superior leadership`
                }));
    }
}
