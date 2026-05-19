import DrawCard from '../../drawcard.js';

class ShibaTetsu extends DrawCard {
    static id = 'shiba-tetsu';

    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain +1/+1',
            limit: ability.limit.unlimitedPerConflict(),
            when: {
                onCardPlayed: (event, context) => event.player === context.player && event.card.hasTrait('spell') && this.game.isDuringConflict()
            },
            effect: 'give him +1{1}/+1{2}',
            effectArgs: () => ['military', 'political'],
            gameAction: ability.actions.cardLastingEffect({ effect: ability.effects.modifyBothSkills(1) })
        });
    }
}


export default ShibaTetsu;
