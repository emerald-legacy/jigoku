import { CardType, Players, Location } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type { AbilityContext } from '../../../AbilityContext.js';

export default class ObligationsOfHospitality extends DrawCard {
    static id = 'obligations-of-hospitality';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            match: (player) => player.imperialFavor !== '',
            effect: AbilityDsl.effects.reduceCost({ match: (card, source) => card === source })
        });

        this.action('Take control of a character')
            .condition(() => this.game.isDuringConflict())
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => !card.anotherUniqueInPlay(context.player) && card.costLessThan(3)
            }, AbilityDsl.actions.cardLastingEffect((context) => ({
                effect: AbilityDsl.effects.takeControl(context.player)
            })))
            .effect('take control of {0}');
    }

    canPlay(context: AbilityContext, playType: string) {
        return !!context.player.opponent && context.player.isMoreHonorable() && super.canPlay(context, playType);
    }
}
