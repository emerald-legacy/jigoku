import { msg } from '../../../GameChat.js';
import { perConflict } from '../../../AbilityLimit.js';
import { modifyProvinceStrength } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class DesperateDefense extends DrawCard {
    static id = 'desperate-defense';

    override setupCardAbilities() {
        this.action('Add Province Strength')
            .condition((context) => context.player.cardsInPlay.some((card) => card.isParticipating()))
            .selectAttackedProvince({
                message: (context, cards) => msg`${context.player} increases the strength of ${cards}`,
                gameAction: cardLastingEffect({
                    effect: modifyProvinceStrength(3)
                })
            })
            .chatText('increase the strength of an attacked province by 3')
            .max(perConflict(1));
    }
}
