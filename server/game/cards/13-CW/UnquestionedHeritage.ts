import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import { attach, discardFromPlay, ifAble, selectCard } from '../../GameActions/GameActions.js';

class UnquestionedHeritage extends DrawCard {
    static id = 'unquestioned-heritage';

    setupCardAbilities() {
        this.action('Move an attachment')
            .condition((context) => context.game.rings.air.isConsideredClaimed(context.player))
            .target({
                cardType: CardType.Attachment,
                controller: Players.Any,
                cardCondition: (card, context) => Boolean(card.parentCharacter?.controller === context.player)
            }, selectCard((context) => ({
                cardType: CardType.Character,
                cardCondition: (card) => card !== context.target.parentCharacter,
                message: (context, card) => msg`${context.player} moves ${context.target} to ${card}`,
                gameAction: ifAble({
                    ifAbleAction: attach({
                        attachment: context.target
                    }),
                    otherwiseAction: discardFromPlay({ target: context.target })
                })
            })))
            .chatText('move {0} to another character');
    }
}


export default UnquestionedHeritage;
