import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { randomHandCards } from '../randomHandCards.js';

export default class ShrewdInvestigator extends DrawCard {
    static id = 'shrewd-investigator';

    override setupCardAbilities() {
        this.action('Look at random cards from your opponent\'s hand')
            .condition((context) => context.source.isParticipating() && context.player.opponent !== undefined)
            .lookAt((context) => ({
                target: randomHandCards(context.player.opponent, context.player.getNumberOfFacedownProvinces())
            }))
            .chatText((context) => {
                const amount = Math.min(context.player.getNumberOfFacedownProvinces(), context.player.opponent?.hand.length ?? 0);
                return msg`look at ${amount} random card${amount === 1 ? '' : 's'} in ${context.player.opponent}'s hand`;
            });
    }
}
