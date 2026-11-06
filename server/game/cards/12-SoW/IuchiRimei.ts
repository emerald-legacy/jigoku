import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import { attach, selectCard } from '../../GameActions/GameActions.js';

class IuchiRimei extends DrawCard {
    static id = 'iuchi-rimei';

    override setupCardAbilities() {
        this.action('Move an attachment')
            .target({
                cardType: CardType.Attachment,
                controller: Players.Opponent,
                cardCondition: (card) => Boolean(card.costLessThan(2) && card.parentCharacter)
            }, selectCard((context) => ({
                cardCondition: (card) => card !== context.target?.parentCharacter && card.controller === context.target?.parentCharacter?.controller && card.type === CardType.Character,
                message: (context, card) => msg`${context.player} moves ${context.target} to ${card}`,
                gameAction: attach({
                    attachment: context.target,
                    ignoreUniqueness: true,
                    evenIfIllegal: true
                })
            })))
            .chatText('move {0} to another character');
    }
}


export default IuchiRimei;
