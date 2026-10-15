import { unlimited } from '../../../AbilityLimit.js';
import DrawCard from '../../../DrawCard.js';

export default class AkodoYoshitsune extends DrawCard {
    static id = 'akodo-yoshitsune';

    override setupCardAbilities() {
        this.reaction('Gain an honor')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.player
            })
            .gainHonor()
            .limit(unlimited());
    }
}
