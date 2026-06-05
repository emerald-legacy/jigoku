import { CardType, Players, Location } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type Player from '../../../Player.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';

export default class ObligationsOfHospitality extends DrawCard {
    static id = 'obligations-of-hospitality';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            match: (player: Player) => player.imperialFavor !== '',
            effect: AbilityDsl.effects.reduceCost({ match: (card, source) => card === source })
        });

        this.action({
            title: 'Take control of a character',
            condition: () => this.game.isDuringConflict(),
            target: {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => !card.anotherUniqueInPlay(context.player) && card.costLessThan(3),
                gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                    effect: AbilityDsl.effects.takeControl(context.player)
                }))
            },
            effect: 'take control of {0}'
        });
    }

    canPlay(context: TriggeredAbilityContext, playType: string) {
        return !!context.player.opponent && context.player.isMoreHonorable() && super.canPlay(context, playType);
    }
}
