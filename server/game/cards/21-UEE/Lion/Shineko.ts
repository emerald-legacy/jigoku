import { CardType, Location, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class Shineko extends DrawCard {
    static id = 'shineko';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            effect: AbilityDsl.effects.reduceCost({
                amount: (_: any, player: any) =>
                    player.cardsInPlay.some(
                        (card: DrawCard) => card.getType() === CardType.Character && card.hasSomeTrait('scout', 'beastmaster')
                    )
                        ? 1
                        : 0,
                match: (card: any, source: any) => card === source
            })
        });

        this.persistentEffect({
            condition: (context) => context.source.isParticipating(),
            effect: AbilityDsl.effects.mustBeChosen({ restricts: 'opponentsTriggeredActionAbilities' })
        });
    }
}
