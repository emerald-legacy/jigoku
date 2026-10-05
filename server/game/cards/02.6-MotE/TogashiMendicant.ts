import DrawCard from '../../DrawCard.js';
import { Phases } from '../../Constants.js';
import { arrangeTopOfDeck } from '../arrangeTopOfDeck.js';

class TogashiMendicant extends DrawCard {
    static id = 'togashi-mendicant';

    setupCardAbilities() {
        this.reaction('Rearrange top 3 cards of dynasty deck')
            .when({
                onPhaseStarted: (event, context) => event.phase === Phases.Fate && context.player.dynastyDeck.length > 0
            })
            .handler((context) => arrangeTopOfDeck(
                context,
                context.player.dynastyDeck.slice(0, 3),
                'Which card do you want to be on top?',
                (ordered) => context.player.dynastyDeck.splice(0, 3, ...ordered)
            ))
            .effect('rearrange the top 3 cards of their dynasty deck');
    }
}


export default TogashiMendicant;
