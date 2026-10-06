import DrawCard from '../../DrawCard.js';
import { gainHonor } from '../../GameActions/GameActions.js';

class ChroniclerOfConquests extends DrawCard {
    static id = 'chronicler-of-conquests';

    setupCardAbilities() {
        this.action('Gain 1 honor')
            .condition(context => context.source.isParticipating() && context.game.isTraitInPlay('battlefield'))
            .gameAction(gainHonor());
    }
}


export default ChroniclerOfConquests;
