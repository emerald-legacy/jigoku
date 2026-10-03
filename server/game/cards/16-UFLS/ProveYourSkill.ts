import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import type { StatusToken } from '../../StatusToken.js';

class ProveYourSkill extends DrawCard {
    static id = 'prove-your-skill';

    setupCardAbilities() {
        this.action('Discard a status token off a character')
            .tokenTarget('target', {
                cardType: CardType.Character
            }, AbilityDsl.actions.discardStatusToken())
            .effect('discard {1}\'s {2}', context => {
                const token: StatusToken | StatusToken[] | undefined = context?.token;
                if(!token) {
                    return [];
                }
                return [Array.isArray(token) ? token[0].card : token.card, token];
            });
    }

    canPlay(context: AbilityContext, playType: string) {
        if(context.player.opponent && context.player.isMoreHonorable()) {
            return super.canPlay(context, playType);
        }
        return false;
    }
}


export default ProveYourSkill;
