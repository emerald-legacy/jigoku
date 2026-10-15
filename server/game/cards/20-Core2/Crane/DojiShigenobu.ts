import { msg } from '../../../GameChat.js';
import { CardType, Players } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { bow, sendHome } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class DojiShigenobu extends DrawCard {
    static id = 'doji-shigenobu';

    setupCardAbilities() {
        this.conflictAction('Bow a character')
            .cost(costs.bow({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }))
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, bow())
            .afterwards()
            .optional({
                activePromptTitle: 'Do you want to move home?',
                gameAction: sendHome(),
                acceptMessage: (context) => msg`${context.player} chooses to move ${context.source} home`
            });
    }
}
