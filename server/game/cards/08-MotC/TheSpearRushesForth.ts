import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, Players } from '../../Constants.js';

class TheSpearRushesForth extends DrawCard {
    static id = 'the-spear-rushes-forth';

    setupCardAbilities() {
        this.action({
            title: 'Bow a participating character',
            condition: () => this.game.isDuringConflict('military'),
            cost: AbilityDsl.costs.discardStatusToken({
                cardCondition: card => card.isHonored && card.isParticipating()
            }),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}


export default TheSpearRushesForth;
