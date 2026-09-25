import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Players } from '../../Constants.js';

class TheSpearRushesForth extends DrawCard {
    static id = 'the-spear-rushes-forth';

    setupCardAbilities() {
        this.action('Bow a participating character')
            .cost(AbilityDsl.costs.discardStatusToken({
                cardCondition: card => card.isHonored && card.isParticipating()
            }))
            .condition(() => this.game.isDuringConflict('military'))
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating()
            }, AbilityDsl.actions.bow());
    }
}


export default TheSpearRushesForth;
