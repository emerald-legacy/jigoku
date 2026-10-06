import DrawCard from '../../DrawCard.js';
import { gainHonor } from '../../GameActions/GameActions.js';

class BeautifulEntertainer extends DrawCard {
    static id = 'beautiful-entertainer';

    setupCardAbilities() {
        this.interrupt('Gain 2 Honor')
            .when({
                onCardLeavesPlay: (event, context) => event.card === context.source && context.player.opponent && context.player.isLessHonorable()
            })
            .gameAction(gainHonor({
                amount: 2
            }));
    }
}


export default BeautifulEntertainer;
