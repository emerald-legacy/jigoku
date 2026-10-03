import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class ShibaTetsu extends DrawCard {
    static id = 'shiba-tetsu';

    setupCardAbilities() {
        this.reaction('Gain +1/+1')
            .when({
                onCardPlayed: (event, context) => event.player === context.player && event.card.hasTrait('spell') && this.game.isDuringConflict()
            })
            .gameAction(AbilityDsl.actions.cardLastingEffect({ effect: AbilityDsl.effects.modifyBothSkills(1) }))
            .effect('give him +1{1}/+1{2}', () => ['military', 'political'])
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }
}


export default ShibaTetsu;
