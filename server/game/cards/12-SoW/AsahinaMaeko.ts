import DrawCard from '../../DrawCard.js';
import { Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class AsahinaMaeko extends DrawCard {
    static id = 'asahina-maeko';

    setupCardAbilities() {
        this.action('Increase cost to play cards')
            .condition(() => this.game.isDuringConflict())
            .gameAction(AbilityDsl.actions.playerLastingEffect({
                effect: AbilityDsl.effects.increaseCost({
                    amount: 1
                }),
                targetController: Players.Any
            }))
            .effect('increase the cost of cards this conflict for both players');
    }
}


export default AsahinaMaeko;
