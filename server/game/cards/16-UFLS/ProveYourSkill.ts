import DrawCard from '../../DrawCard.js';
import { TargetMode, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ProveYourSkill extends DrawCard {
    static id = 'prove-your-skill';

    setupCardAbilities() {
        this.action({
            title: 'Discard a status token off a character',
            target: {
                mode: TargetMode.Token,
                cardType: CardType.Character,
                gameAction: AbilityDsl.actions.discardStatusToken()
            },
            effect: 'discard {1}\'s {2}',
            effectArgs: context => {
                const token: any = context && (context as any).token;
                if(!token) {
                    return [];
                }
                return [Array.isArray(token) ? token[0].card : token.card, token];
            }
        });
    }

    canPlay(context: any, playType: any) {
        if(context.player.opponent && context.player.isMoreHonorable()) {
            return super.canPlay(context, playType);
        }
        return false;
    }
}


export default ProveYourSkill;
