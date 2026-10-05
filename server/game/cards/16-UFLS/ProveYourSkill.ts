import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ProveYourSkill extends DrawCard {
    static id = 'prove-your-skill';

    setupCardAbilities() {
        this.action('Discard a status token off a character')
            .tokenTarget({
                cardType: CardType.Character
            }, AbilityDsl.actions.discardStatusToken())
            .effect('discard {1}\'s {2}', context => [context.token[0].card, context.token]);
    }

    canPlay(context: AbilityContext, playType: string) {
        if(context.player.isMoreHonorable()) {
            return super.canPlay(context, playType);
        }
        return false;
    }
}


export default ProveYourSkill;
