import DrawCard from '../../DrawCard.js';

class BelovedAdvisor extends DrawCard {
    static id = 'beloved-advisor';

    setupCardAbilities() {
        this.action('Each player draws 1 card')
            .draw((context) => ({
                target: context.game.getPlayers()
            }));
    }
}


export default BelovedAdvisor;
