import DrawCard from '../../DrawCard.js';
import { Location, Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class MeticulousScout extends DrawCard {
    static id = 'meticulous-scout';

    setupCardAbilities() {
        this.action({
            title: 'Blank and reveal a province',
            condition: context => context.player.honorGained(context.game.roundNumber, this.game.currentPhase, true) >= 2,
            target: {
                location: Location.Provinces,
                cardType: CardType.Province,
                controller: Players.Opponent,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.dishonorProvince(),
                    AbilityDsl.actions.reveal({ chatMessage: true })
                ])
            }
        });
    }
}


export default MeticulousScout;
