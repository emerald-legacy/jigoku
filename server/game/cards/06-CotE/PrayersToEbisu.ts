import DrawCard from '../../DrawCard.js';

class PrayersToEbisu extends DrawCard {
    static id = 'prayers-to-ebisu';

    setupCardAbilities() {
        this.action('Re-balance honor and draw a card')
            .loseHonor((context) => ({
                target: context.game.getPlayers().filter((player) => player.honor >= 19),
                amount: 4
            }))
            .gainHonor((context) => ({
                target: context.game.getPlayers().filter((player) => player.honor <= 6),
                amount: 4
            }))
            .draw((context) => ({
                target: context.player
            }))
            .chatText('draw a card, make each player with 19 or more honor lose 4 honor, and make each player with 6 or fewer honor gain 4 honor');
    }
}


export default PrayersToEbisu;
