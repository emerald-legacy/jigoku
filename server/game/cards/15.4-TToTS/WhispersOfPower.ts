import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { Players, CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { modifyPoliticalSkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class WhispersOfPower extends DrawCard {
    static id = 'whispers-of-power';

    override setupCardAbilities() {
        this.action('Gain political power according to fateless characters')
            .condition((context) => context.game.isDuringConflict() && this.getPoliticalPowerChange(context) > 0)
            .cost(costs.payHonor())
            .target({
                cardType: CardType.Character,
                controller: Players.Any
            }, cardLastingEffect((context) => ({
                effect: modifyPoliticalSkill(
                    this.getPoliticalPowerChange(context)
                )
            })))
            .chatText((context) => msg`grant ${context.chatTarget()} +${this.getPoliticalPowerChange(context)} ${'political'} until the end of the conflict`);
    }

    private getPoliticalPowerChange(context: AbilityContext) {
        return (context.player.opponent?.filterCardsInPlay((card) => card.type === CardType.Character && card.getFate() === 0).length ?? 0) * 3;
    }

    override isTemptationsMaho() {
        return true;
    }
}


export default WhispersOfPower;

