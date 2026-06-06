import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import type Ring from '../../Ring.js';

class ArmyOfTheRisingWave extends DrawCard {
    static id = 'army-of-the-rising-wave';

    setupCardAbilities() {
        this.reaction({
            title: 'Place one fate on each unclaimed ring',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            gameAction: AbilityDsl.actions.placeFateOnRing(context =>
                ({ target: Object.values<Ring>(context.game.rings).filter((ring) => ring.isUnclaimed()) }))
        });
    }
}


export default ArmyOfTheRisingWave;
