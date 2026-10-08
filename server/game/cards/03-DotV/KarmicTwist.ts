import DrawCard from '../../DrawCard.js';
import { placeFate, selectCard } from '../../GameActions/GameActions.js';
import { CardType } from '../../Constants.js';

class KarmicTwist extends DrawCard {
    static id = 'karmic-twist';

    setupCardAbilities() {
        this.action('Move fate from a non-unique character')
            .target({
                activePromptTitle: 'Choose a donor character',
                cardType: CardType.Character,
                cardCondition: card => !card.isUnique() && card.getFate() > 0
            }, selectCard((context) => ({
                cardType: CardType.Character,
                activePromptTitle: 'Choose a recipient character',
                cardCondition: (card) => !card.isUnique() && card.getFate() === 0 && card.controller === context.target?.controller,
                message: '{0} moves {1} fate from {2} to {3}',
                messageArgs: card => [context.player, context.target?.getFate() ?? 0, context.target ?? '', card],
                gameAction: placeFate({
                    origin: context.target,
                    amount: context.target?.getFate() ?? 0
                })
            })))
            .chatText('move fate from {0} to another non-unique character');
    }
}


export default KarmicTwist;
