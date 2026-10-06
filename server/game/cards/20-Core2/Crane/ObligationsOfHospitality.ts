import { CardType, Players, Location } from '../../../Constants.js';
import { reduceCost, takeControl } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import type { AbilityContext } from '../../../AbilityContext.js';

export default class ObligationsOfHospitality extends DrawCard {
    static id = 'obligations-of-hospitality';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            match: (player) => player.imperialFavor !== '',
            effect: reduceCost({ match: (card, source) => card === source })
        });

        this.conflictAction('Take control of a character')
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => !card.anotherUniqueInPlay(context.player) && card.costLessThan(3)
            }, cardLastingEffect((context) => ({
                effect: takeControl(context.player)
            })))
            .effect('take control of {0}');
    }

    canPlay(context: AbilityContext, playType: string) {
        return !!context.player.opponent && context.player.isMoreHonorable() && super.canPlay(context, playType);
    }
}
