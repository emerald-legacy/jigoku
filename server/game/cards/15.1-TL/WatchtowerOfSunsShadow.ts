import DrawCard from '../../DrawCard.js';
import { modifyBothSkills } from '../../effects.js';
import { Players } from '../../Constants.js';
import { defendingAtKaiuWall } from '../kaiuWall.js';

class WatchtowerOfSunsShadow extends DrawCard {
    static id = 'watchtower-of-sun-s-shadow';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => defendingAtKaiuWall(context.player, context.game.currentConflict),
            targetController: Players.Opponent,
            match: (card) => card.isAttacking(),
            effect: modifyBothSkills((card) => -card.getFate())
        });

        this.forcedInterrupt('Lose 2 fate')
            .when({
                onBreakProvince: (event, context) => event.card.controller === context.player && event.card.location === context.source.location
            })
            .loseFate((context) => ({
                amount: 2,
                target: context.player
            }));
    }
}


export default WatchtowerOfSunsShadow;
