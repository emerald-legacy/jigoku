import { unlimitedPerConflict } from '../../AbilityLimit.js';
import { modifyBothSkills } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { msg } from '../../GameChat.js';

class YasukiOguri extends DrawCard {
    static id = 'yasuki-oguri';

    setupCardAbilities() {
        this.reaction('Gain +1/+1')
            .when({
                onCardPlayed: (event, context) => event.player === context.player.opponent && event.card.type === CardType.Event && context.source.isDefending()
            })
            .cardLastingEffect({ effect: modifyBothSkills(1) })
            .chatText(() => msg`give him +1${'military'}/+1${'political'}`)
            .limit(unlimitedPerConflict());
    }
}


export default YasukiOguri;
