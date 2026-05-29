import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class BeautifulEntertainer extends DrawCard {
    static id = 'beautiful-entertainer';

    setupCardAbilities() {
        this.interrupt({
            title: 'Gain 2 Honor',
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source && context.player.opponent && context.player.isLessHonorable()
            },
            gameAction: AbilityDsl.actions.gainHonor(context => ({
                target: context.player,
                amount: 2
            }))
        });
    }
}


export default BeautifulEntertainer;
