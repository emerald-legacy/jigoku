import { CardType, Players, Location } from '../../../Constants.js';
import { reduceCost, takeControl } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class ObligationsOfHospitality extends DrawCard {
    static id = 'obligations-of-hospitality';

    override setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            match: (player) => player.imperialFavor !== '',
            effect: reduceCost({ match: (card, source) => card === source })
        });

        this.conflictAction('Take control of a character')
            .ifCondition((context) => !!context.player.opponent && context.player.isMoreHonorable())
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => card.isParticipating() && !card.anotherUniqueInPlay(context.player) && card.costLessThan(3)
            }, cardLastingEffect((context) => ({
                effect: takeControl(context.player)
            })))
            .chatText('take control of {0}');
    }
}
