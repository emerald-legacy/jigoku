import { perPhase } from '../../AbilityLimit.js';
import { reduceCost } from '../../effects.js';
import { Location, Players } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';
import { placeInProvinces } from '../placeInProvinces.js';

class TheWealthOfTheCrane extends DrawCard {
    static id = 'the-wealth-of-the-crane';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            effect: reduceCost({
                amount: (_card, player: Player) => {
                    return player.getNumberOfFaceupProvinces();
                },
                match: (card, source) => card === source
            })
        });

        this.action('Look at your dynasty deck')
            .condition((context) => context.player.dynastyDeck.length > 0)
            .handler((context) => placeInProvinces(context, context.player.dynastyDeck.slice(0, 10)))
            .chatText('look at the top ten cards of their dynasty deck')
            .max(perPhase(1));
    }
}


export default TheWealthOfTheCrane;
