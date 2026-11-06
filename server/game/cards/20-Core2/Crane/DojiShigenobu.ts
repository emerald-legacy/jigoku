import { msg } from '../../../GameChat.js';
import { CardType } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { bow, sendHome } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class DojiShigenobu extends DrawCard {
    static id = 'doji-shigenobu';

    override setupCardAbilities() {
        this.conflictAction('Bow a character')
            .cost(costs.bow({
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isParticipatingFor(context.player)
            }))
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) => !!context.player.opponent && card.isParticipatingFor(context.player.opponent)
            }, bow())
            .then()
            .optional({
                activePromptTitle: 'Do you want to move home?',
                gameAction: sendHome(),
                acceptMessage: (context) => msg`${context.player} chooses to move ${context.source} home`
            });
    }
}
