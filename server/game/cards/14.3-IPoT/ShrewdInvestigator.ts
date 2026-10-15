import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { randomHandCards } from '../randomHandCards.js';

export default class ShrewdInvestigator extends DrawCard {
    static id = 'shrewd-investigator';

    setupCardAbilities() {
        this.action('Look at random cards from your opponent\'s hand')
            .condition((context) => context.source.isParticipating() && context.player.opponent !== undefined)
            .lookAt((context) => ({
                target: randomHandCards(context.player.opponent, context.player.getNumberOfFacedownProvinces())
            }))
            .chatText((context) => msg`look at ${context.player.getNumberOfFacedownProvinces()} random card${context.player.getNumberOfFacedownProvinces() === 1 ? '' : 's'} in ${context.player.opponent}'s hand`);
    }
}
