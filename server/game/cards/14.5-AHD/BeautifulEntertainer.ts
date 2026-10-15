import DrawCard from '../../DrawCard.js';

class BeautifulEntertainer extends DrawCard {
    static id = 'beautiful-entertainer';

    setupCardAbilities() {
        this.interrupt('Gain 2 Honor')
            .when({
                onCardLeavesPlay: (event, context) => event.card === context.source && context.player.opponent && context.player.isLessHonorable()
            })
            .gainHonor(2);
    }
}


export default BeautifulEntertainer;
