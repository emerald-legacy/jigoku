import AbilityDsl from '../../abilitydsl.js';
import { modifyBothSkills } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class YasukiOguri extends DrawCard {
    static id = 'yasuki-oguri';

    setupCardAbilities() {
        this.reaction('Gain +1/+1')
            .when({
                onCardPlayed: (event, context) => event.player === context.player.opponent && event.card.type === CardType.Event && context.source.isDefending()
            })
            .gameAction(cardLastingEffect({ effect: modifyBothSkills(1) }))
            .effect('give him +1{1}/+1{2}', () => ['military', 'political'])
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }
}


export default YasukiOguri;
