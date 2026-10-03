import DrawCard from '../../DrawCard.js';
import { arrangeTopOfDeck } from '../arrangeTopOfDeck.js';

class HirumaKogoe extends DrawCard {
    static id = 'hiruma-kogoe';

    setupCardAbilities() {
        this.reaction('Rearrange top 3 cards of your conflict deck')
            .when({
                onPhaseStarted: (event, context) => event.phase === 'draw' && context.player.opponent && context.player.honor < context.player.opponent.honor
            })
            .handler((context) => arrangeTopOfDeck(
                context,
                context.player.conflictDeck.slice(0, 3),
                'Which card do you want to be on top?',
                (ordered) => context.player.conflictDeck.splice(0, 3, ...ordered)
            ))
            .effect('rearrange the top 3 cards of their conflict deck');
    }
}


export default HirumaKogoe;
