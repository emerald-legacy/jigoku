import DrawCard from '../../DrawCard.js';
import { handler, resolveRingEffect, sequential } from '../../GameActions/GameActions.js';

class Enlightenment extends DrawCard {
    static id = 'enlightenment';

    setupCardAbilities() {
        this.action('Resolve all claimed ring effects')
            .condition(context => context.player.getClaimedRings().length > 0)
            .gameAction(sequential([
                resolveRingEffect(context => ({
                    player: context.player,
                    target: context.player.getClaimedRings()
                })),
                handler({
                    handler: context => {
                        if(context.player.getClaimedRings().length >= 5) {
                            this.game.recordWinner(context.player, 'enlightenment');
                        }
                    }
                })
            ]))
            .chatText('resolve all claimed ring effects');
    }
}


export default Enlightenment;
