import { CardType } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { sendHome } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class DaidojiNami extends DrawCard {
    static id = 'daidoji-nami';

    override setupCardAbilities() {
        this.conflictAction('Send a character home')
            .cost(costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }))
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) => !!context.player.opponent && card.isParticipatingFor(context.player.opponent)
            }, sendHome());
    }
}
