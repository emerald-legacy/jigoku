import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { Players, CardType, Duration } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class WhispersOfPower extends DrawCard {
    static id = 'whispers-of-power';

    setupCardAbilities() {
        this.action({
            title: 'Gain political power according to fateless characters',
            condition: (context: AbilityContext) => context.game.isDuringConflict(),
            cost: AbilityDsl.costs.payHonor(),
            target:{
                cardType: CardType.Character,
                controller: Players.Any
            },
            gameAction: AbilityDsl.actions.cardLastingEffect((context: AbilityContext) => ({
                duration: Duration.UntilEndOfConflict,
                target: context.target,
                effect: AbilityDsl.effects.modifyPoliticalSkill(
                    this.getPoliticalPowerChange(context)
                )
            })),
            effect: 'grant {0} +{1} {2} until the end of the conflict',
            effectArgs: (context: AbilityContext) => [this.getPoliticalPowerChange(context), 'political']
        });
    }

    getPoliticalPowerChange(context: AbilityContext) {
        return (context.player.opponent as Player).filterCardsInPlay((card) => card.type === CardType.Character && card.getFate() === 0).length * 3;
    }

    isTemptationsMaho() {
        return true;
    }
}


export default WhispersOfPower;

