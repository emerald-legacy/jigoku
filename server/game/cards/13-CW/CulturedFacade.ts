import DrawCard from '../../DrawCard.js';
import { cardCannot } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class CulturedFacade extends DrawCard {
    static id = 'cultured-facade';

    setupCardAbilities() {
        this.conflictAction('Prevent targeting')
            .gameAction(cardLastingEffect(context => ({
                target: context.game.currentConflict?.getParticipants() ?? [],
                effect: cardCannot({
                    cannot: 'target',
                    restricts: 'eventPlayedByHigherBidPlayer'
                })
            })))
            .effect('prevent characters from being targeted by events played by players with a higher bid value than that of the character\'s controller');
    }
}


export default CulturedFacade;
