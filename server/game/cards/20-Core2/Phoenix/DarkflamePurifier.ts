import { CardType, Phase, Players } from '../../../Constants.js';
import { dishonor } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class DarkflamePurifier extends DrawCard {
    static id = 'darkflame-purifier';

    override setupCardAbilities() {
        this.reaction('Dishonor a character')
            .when({
                onMoveFate: (event, context) =>
                    context.game.currentPhase !== Phase.Fate &&
                    !event.isContingent &&
                    event.origin?.type === CardType.Character &&
                    'controller' in event.origin &&
                    event.origin.controller === context.player.opponent &&
                    (event.fate ?? 0) > 0
            })
            .target({
                controller: Players.Any,
                cardType: CardType.Character
            }, dishonor());
    }
}
