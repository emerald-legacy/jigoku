import AbilityDsl from '../../../abilitydsl';
import { CardTypes, Locations, Players } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class Shineko extends DrawCard {
    static id = 'shineko';

    setupCardAbilities() {
        this.persistentEffect({
            location: Locations.Any,
            targetController: Players.Any,
            effect: AbilityDsl.effects.reduceCost({
                amount: (_, player) =>
                    player.cardsInPlay.some(
                        (card: DrawCard) =>
                            card.getType() === CardTypes.Character && card.hasSomeTrait('shugenja', 'beastmaster')
                    )
                        ? 1
                        : 0,
                match: (card, source) => card === source
            })
        });

        this.persistentEffect({
            condition: (context) => context.source.isParticipating(),
            effect: AbilityDsl.effects.mustBeChosen({ restricts: 'opponentsEvents' })
        });
    }
}
