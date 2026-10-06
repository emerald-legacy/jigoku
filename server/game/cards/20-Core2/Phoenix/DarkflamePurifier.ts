import { CardType, Phases, Players } from '../../../Constants.js';
import { dishonor } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class DarkflamePurifier extends DrawCard {
    static id = 'darkflame-purifier';

    setupCardAbilities() {
        this.reaction('Dishonor a character')
            .when({
                onMoveFate: (event, context) =>
                    context.game.currentPhase !== Phases.Fate &&
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
