import { msg } from '../../../GameChat.js';
import DrawCard from '../../../DrawCard.js';
import { Players, CardType } from '../../../Constants.js';
import { attach, discardFromPlay, ifAble, selectCard } from '../../../GameActions/GameActions.js';

class HiddenLineage extends DrawCard {
    static id = 'hidden-lineage';

    setupCardAbilities() {
        this.action('Move an attachment')
            .target({
                cardType: CardType.Attachment,
                controller: Players.Any,
                cardCondition: (card, context) => card.parentCharacter?.controller === context.player
            }, selectCard((context) => ({
                cardType: CardType.Character,
                cardCondition: (card) => card !== context.target.parentCharacter && card.controller === context.player,
                message: (context, card) => msg`${context.player} moves ${context.target} to ${card}`,
                gameAction: ifAble({
                    ifAbleAction: attach({
                        attachment: context.target
                    }),
                    otherwiseAction: discardFromPlay({ target: context.target })
                })
            })))
            .chatText('move {0} to another character they control');
    }
}


export default HiddenLineage;
