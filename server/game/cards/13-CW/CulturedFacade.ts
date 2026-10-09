import DrawCard from '../../DrawCard.js';
import { cardCannot } from '../../effects.js';
import { RestrictionType, RestrictionScope } from '../../Constants.js';

class CulturedFacade extends DrawCard {
    static id = 'cultured-facade';

    setupCardAbilities() {
        this.conflictAction('Prevent targeting')
            .cardLastingEffect((context) => ({
                target: context.game.currentConflict?.getParticipants() ?? [],
                effect: cardCannot({
                    cannot: RestrictionType.Target,
                    appliesTo: RestrictionScope.EventPlayedByHigherBidPlayer
                })
            }))
            .chatText('prevent characters from being targeted by events played by players with a higher bid value than that of the character\'s controller');
    }
}


export default CulturedFacade;
