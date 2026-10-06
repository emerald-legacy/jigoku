import { CardType, Location, Players } from '../../../Constants.js';
import { mustBeChosen, reduceCost } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class Shineko extends DrawCard {
    static id = 'shineko';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            effect: reduceCost({
                amount: (_, player) =>
                    player.cardsInPlay.some(
                        (card) => card.getType() === CardType.Character && card.hasSomeTrait('scout', 'beastmaster')
                    )
                        ? 1
                        : 0,
                match: (card, source) => card === source
            })
        });

        this.persistentEffect({
            condition: (context) => context.source.isParticipating(),
            effect: mustBeChosen({ restricts: 'opponentsTriggeredActionAbilities' })
        });
    }
}
