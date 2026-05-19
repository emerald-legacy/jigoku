import DrawCard from '../../drawcard.js';
import { TargetModes, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ProveYourSkill extends DrawCard {
    static id = 'prove-your-skill';

    setupCardAbilities() {
        this.action({
            title: 'Discard a status token off a character',
            target: {
                mode: TargetModes.Token,
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.discardStatusToken()
            },
            effect: 'discard {1}\'s {2}',
            effectArgs: context => [
                context.token[0].card,
                context.token
            ]
        });
    }

    canPlay(context, playType) {
        if(context.player.opponent && context.player.isMoreHonorable()) {
            return super.canPlay(context, playType);
        }
        return false;
    }
}


export default ProveYourSkill;
