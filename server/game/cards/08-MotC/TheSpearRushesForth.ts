import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Players, ConflictType } from '../../Constants.js';

class TheSpearRushesForth extends DrawCard {
    static id = 'the-spear-rushes-forth';

    setupCardAbilities() {
        this.action('Bow a participating character')
            .cost(AbilityDsl.costs.discardStatusToken({
                cardCondition: card => card.isHonored && card.isDrawCard() && card.isParticipating()
            }))
            .condition(() => this.game.isDuringConflict(ConflictType.Military))
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating()
            }, AbilityDsl.actions.bow());
    }
}


export default TheSpearRushesForth;
