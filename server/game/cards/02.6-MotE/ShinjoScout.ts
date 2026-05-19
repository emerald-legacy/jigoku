import DrawCard from '../../drawcard.js';

class ShinjoScout extends DrawCard {
    static id = 'shinjo-scout';

    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain 1 fate',
            when: {
                onPassDuringDynasty: (event, context) => event.player === context.player && event.firstToPass
            },
            gameAction: ability.actions.gainFate()
        });
    }
}


export default ShinjoScout;
