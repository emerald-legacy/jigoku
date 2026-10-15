import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { discardStatusToken } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

class ProveYourSkill extends DrawCard {
    static id = 'prove-your-skill';

    override setupCardAbilities() {
        this.action('Discard a status token off a character')
            .playOnlyIf((context) => context.player.isMoreHonorable())
            .tokenTarget({
                cardType: CardType.Character
            }, discardStatusToken())
            .chatText((context) => msg`discard ${context.token[0].card}'s ${context.token}`);
    }
}


export default ProveYourSkill;
