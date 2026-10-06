import DrawCard from '../../../DrawCard.js';
import { Location } from '../../../Constants.js';
import { discardStatusToken, gainHonor, multiple } from '../../../GameActions/GameActions.js';
import { msg } from '../../../GameChat.js';

class HeraldOfJade extends DrawCard {
    static id = 'herald-of-jade';

    setupCardAbilities() {
        this.reaction('Discard a status token and gain 1 honor')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source
            })
            .tokenTarget({
                location: Location.Any
            }, multiple([
                discardStatusToken(),
                gainHonor(context => ({
                    target: context.player
                }))
            ]))
            .effect((context) => msg`discard ${context.token?.[0]?.card}'s ${context.token} and gain 1 honor`);
    }
}


export default HeraldOfJade;
