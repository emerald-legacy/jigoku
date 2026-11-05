import { perPhase } from '../../AbilityLimit.js';
import { reduceCost } from '../../effects.js';
import { Location, Players } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';
import { placeInProvinces } from '../placeInProvinces.js';
import { msg } from '../../GameChat.js';
import { topCards } from '../topCards.js';

class TheWealthOfTheCrane extends DrawCard {
    static id = 'the-wealth-of-the-crane';

    override setupCardAbilities() {
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
            .chatText((context) => msg`look at the ${topCards(10, context.player.dynastyDeck.length, true)} of their dynasty deck`)
            .max(perPhase(1));
    }
}


export default TheWealthOfTheCrane;
