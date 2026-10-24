import { Trait } from '../../Constants.js';
import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { modifyProvinceStrength } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { controlsParticipating } from '../controlsParticipating.js';

class DisdainfulRemark extends DrawCard {
    static id = 'disdainful-remark';

    override setupCardAbilities() {
        this.action('Add Province Strength')
            .ifCondition((context) => controlsParticipating(context.player, Trait.Courtier))
            .condition((context) => !!context.player.opponent && context.player.opponent.hand.length > 0)
            .selectAttackedProvince({
                message: (context, cards) => msg`${context.player} increases the strength of ${cards} by ${context.player.opponent?.hand.length ?? 0}`,
                gameAction: cardLastingEffect((context) => ({
                    effect: modifyProvinceStrength(context.player.opponent?.hand.length ?? 0)
                }))
            })
            .chatText('increase the strength of an attacked province');
    }
}


export default DisdainfulRemark;
