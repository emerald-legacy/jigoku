import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';
import { Locations } from '../../Constants.js';

class MeishodoWielder extends DrawCard {
    static id = 'meishodo-wielder';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.persistentEffect({
            location: Locations.Any,
            condition: (context: any) => this.game.getFirstPlayer() === context.player,
            effect: ability.effects.reduceCost({
                match: (card: any, source: any) => card === source
            })
        });
    }
}


export default MeishodoWielder;
