import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import { attach, discardFromPlay, ifAble, selectCard } from '../../GameActions/GameActions.js';

class IuchiRimei extends DrawCard {
    static id = 'iuchi-rimei';

    setupCardAbilities() {
        this.action('Move an attachment')
            .target({
                cardType: CardType.Attachment,
                controller: Players.Opponent,
                cardCondition: (card) => Boolean(card.costLessThan(2) && card.parentCharacter)
            }, selectCard((context) => ({
                cardCondition: (card) => card !== context.target?.parentCharacter && card.controller === context.target?.parentCharacter?.controller && card.type === CardType.Character,
                message: '{0} moves {1} to {2}',
                messageArgs: (card) => [context.player, context.target, card],
                gameAction: ifAble({
                    ifAbleAction: attach({
                        attachment: context.target,
                        ignoreUniqueness: true
                    }),
                    otherwiseAction: discardFromPlay({ target: context.target })
                })
            })))
            .chatText('move {0} to another character');
    }
}


export default IuchiRimei;
