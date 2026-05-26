import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class ResourcefulMahoTsukai extends DrawCard {
    static id = 'resourceful-maho-tsukai';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isDishonored,
            effect: AbilityDsl.effects.reduceCost({
                match: (card: any) => card.hasTrait('maho')
            })
        });
    }
}


export default ResourcefulMahoTsukai;
