import { msg } from '../../../GameChat.js';
import { CardType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class ForcedRetirement extends DrawCard {
    static id = 'forced-retirement';

    public override setupCardAbilities() {
        this.action('Remove negative status tokens from a character, and discard it from play')
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => (card.isDishonored || card.isTainted) && !card.isParticipating()
            })
            .discardStatusToken((context) => ({ target: context.target.statusTokens }))
            .removeFate((context) => ({
                target: context.target,
                amount: context.target.getFate(),
                recipient: context.target.owner
            }))
            .chatText((context) => context.target.fate > 0
                ? msg`expiate ${context.chatTarget()}'s misdeeds by retiring them to the nearest monastery, recovering their ${context.target.fate} fate. Let them contemplate their sins`
                : msg`expiate ${context.chatTarget()}'s misdeeds by retiring them to the nearest monastery. Let them contemplate their sins`)
            .then()
            .discardFromPlay((context) => ({ target: context.target }))
            .gainHonor((context) => ({ target: context.player }));
    }
}
