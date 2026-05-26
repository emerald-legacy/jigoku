import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class ShinjoScout extends DrawCard {
    static id = 'shinjo-scout';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Gain 1 fate',
            when: {
                onPassDuringDynasty: (event: any, context) => event.player === context.player && event.firstToPass
            },
            gameAction: ability.actions.gainFate()
        });
    }
}


export default ShinjoScout;
