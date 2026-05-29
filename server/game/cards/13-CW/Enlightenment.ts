import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class Enlightenment extends DrawCard {
    static id = 'enlightenment';

    setupCardAbilities() {
        this.action({
            title: 'Resolve all claimed ring effects',
            condition: context => context.player.getClaimedRings().length > 0,
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.resolveRingEffect(context => ({
                    player: context.player,
                    target: context.player.getClaimedRings()
                })),
                AbilityDsl.actions.handler({
                    handler: context => {
                        if(context.player.getClaimedRings().length >= 5) {
                            this.game.recordWinner(context.player, 'enlightenment');
                        }
                    }
                })
            ]),
            effect: 'resolve all claimed ring effects'
        });
    }
}


export default Enlightenment;
