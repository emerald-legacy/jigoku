import AbilityDsl from '../../abilitydsl.js';
import { modifyBothSkills } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
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
            .gameAction(cardLastingEffect({ effect: modifyBothSkills(1) }))
            .effect(() => msg`give him +1${'military'}/+1${'political'}`)
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }
}


export default YasukiOguri;
