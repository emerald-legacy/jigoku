import DrawCard from '../../drawcard.js';
import { Locations } from '../../Constants.js';

class MeishodoWielder extends DrawCard {
    static id = 'meishodo-wielder';

    setupCardAbilities(ability) {
        this.persistentEffect({
            location: Locations.Any,
            condition: context => this.game.getFirstPlayer() === context.player,
            effect: ability.effects.reduceCost({
                match: (card, source) => card === source
            })
        });
    }
}


export default MeishodoWielder;
