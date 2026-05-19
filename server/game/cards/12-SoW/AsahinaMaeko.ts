import DrawCard from '../../drawcard.js';
import { Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class AsahinaMaeko extends DrawCard {
    static id = 'asahina-maeko';

    setupCardAbilities() {
        this.action({
            title: 'Increase cost to play cards',
            condition: () => this.game.isDuringConflict(),
            effect: 'increase the cost of cards this conflict for both players',
            gameAction: AbilityDsl.actions.playerLastingEffect({
                effect: AbilityDsl.effects.increaseCost({
                    amount: 1
                }),
                targetController: Players.Any
            })
        });
    }
}


export default AsahinaMaeko;
