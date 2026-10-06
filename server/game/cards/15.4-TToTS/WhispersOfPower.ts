import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { modifyPoliticalSkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class WhispersOfPower extends DrawCard {
    static id = 'whispers-of-power';

    setupCardAbilities() {
        this.action('Gain political power according to fateless characters')
            .cost(AbilityDsl.costs.payHonor())
            .condition((context) => context.game.isDuringConflict())
            .target({
                cardType: CardType.Character,
                controller: Players.Any
            }, cardLastingEffect((context) => ({
                effect: modifyPoliticalSkill(
                    this.getPoliticalPowerChange(context)
                )
            })))
            .effect('grant {0} +{1} {2} until the end of the conflict', (context) => [this.getPoliticalPowerChange(context), 'political']);
    }

    private getPoliticalPowerChange(context: AbilityContext) {
        return (context.player.opponent?.filterCardsInPlay((card) => card.type === CardType.Character && card.getFate() === 0).length ?? 0) * 3;
    }

    isTemptationsMaho() {
        return true;
    }
}


export default WhispersOfPower;

