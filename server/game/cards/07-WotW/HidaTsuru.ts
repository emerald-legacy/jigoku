import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { modifyBothSkills } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class HidaTsuru extends DrawCard {
    static id = 'hida-tsuru';

    setupCardAbilities() {
        this.reaction('Give this character +1/+1')
            .when({
                onMoveToConflict: (_event, context) => context.source.isParticipating()
            })
            .gameAction(cardLastingEffect({ effect: modifyBothSkills(1) }))
            .effect('give him +1{1}/+1{2}', () => ['military', 'political'])
            .limit(AbilityDsl.limit.unlimitedPerConflict());

        this.reaction('Give this character +1/+1')
            .when({
                onCardPlayed: (event, context) => event.card.isParticipating() && context.source.isParticipating()
            })
            .gameAction(cardLastingEffect({ effect: modifyBothSkills(1) }))
            .effect('give him +1{1}/+1{2}', () => ['military', 'political'])
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }
}


export default HidaTsuru;
