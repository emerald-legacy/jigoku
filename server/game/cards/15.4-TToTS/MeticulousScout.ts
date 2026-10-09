import DrawCard from '../../DrawCard.js';
import { Location, Players, CardType } from '../../Constants.js';
import { dishonorProvince, reveal, sequential } from '../../GameActions/GameActions.js';

class MeticulousScout extends DrawCard {
    static id = 'meticulous-scout';

    setupCardAbilities() {
        this.action('Blank and reveal a province')
            .condition((context) => context.player.honorGained(context.game.roundNumber, this.game.currentPhase, true) >= 2)
            .target({
                location: Location.Provinces,
                cardType: CardType.Province,
                controller: Players.Opponent
            }, sequential([
                dishonorProvince(),
                reveal({ chatMessage: true })
            ]));
    }
}


export default MeticulousScout;
