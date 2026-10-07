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
            .effect('look at {1} random card{3} in {2}\'s hand', (context) => [
                context.player.getNumberOfFacedownProvinces(),
                context.player.opponent,
                context.player.getNumberOfFacedownProvinces() === 1 ? '' : 's'
            ]);
    }
}
