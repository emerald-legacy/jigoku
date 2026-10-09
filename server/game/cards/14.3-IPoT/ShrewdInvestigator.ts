import { msg } from '../../GameChat.js';
import { lookAt } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { shuffle } from '../../utils/random.js';

export default class ShrewdInvestigator extends DrawCard {
    static id = 'shrewd-investigator';

    setupCardAbilities() {
        this.action('Look at random cards from your opponent\'s hand')
            .condition((context) => context.source.isParticipating() && context.player.opponent !== undefined)
            .gameAction(lookAt((context) => ({
                target: shuffle(context.player.opponent?.hand ?? [])
                    .slice(0, context.player.getNumberOfFacedownProvinces())
                    .sort((a, b) => a.name.localeCompare(b.name))
            })))
            .chatText((context) => msg`look at ${context.player.getNumberOfFacedownProvinces()} random card${context.player.getNumberOfFacedownProvinces() === 1 ? '' : 's'} in ${context.player.opponent}'s hand`);
    }
}
