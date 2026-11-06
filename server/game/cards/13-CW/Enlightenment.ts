import DrawCard from '../../DrawCard.js';

class Enlightenment extends DrawCard {
    static id = 'enlightenment';

    override setupCardAbilities() {
        this.action('Resolve all claimed ring effects')
            .condition((context) => context.player.getClaimedRings().length > 0)
            .resolveRingEffect((context) => ({
                player: context.player,
                target: context.player.getClaimedRings()
            }))
            .chatText('resolve all claimed ring effects')
            .thenIf((context) => context.player.getClaimedRings().length >= 5)
            .handler((context) => this.game.recordWinner(context.player, 'enlightenment'));
    }
}


export default Enlightenment;
