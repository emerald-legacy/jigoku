import { CardType } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { bow, sendHome } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class IkomaNatsuko extends DrawCard {
    static id = 'ikoma-natsuko';

    override setupCardAbilities() {
        this.conflictAction('Bow and send home a participating character')
            .cost(costs.discardImperialFavor())
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) => !!context.player.opponent && card.isParticipatingFor(context.player.opponent)
            }, bow(), sendHome())
            .chatText('bow and send {0} home');
    }
}
