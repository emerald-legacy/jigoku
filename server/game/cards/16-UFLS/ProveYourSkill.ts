import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { CardType } from '../../Constants.js';
import { discardStatusToken } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

class ProveYourSkill extends DrawCard {
    static id = 'prove-your-skill';

    setupCardAbilities() {
        this.action('Discard a status token off a character')
            .tokenTarget({
                cardType: CardType.Character
            }, discardStatusToken())
            .effect((context) => msg`discard ${context.token[0].card}'s ${context.token}`);
    }

    canPlay(context: AbilityContext, playType: string) {
        if(context.player.isMoreHonorable()) {
            return super.canPlay(context, playType);
        }
        return false;
    }
}


export default ProveYourSkill;
