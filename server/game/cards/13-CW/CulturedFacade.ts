import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class CulturedFacade extends DrawCard {
    static id = 'cultured-facade';

    setupCardAbilities() {
        this.conflictAction('Prevent targeting')
            .gameAction(AbilityDsl.actions.cardLastingEffect(context => ({
                target: context.game.currentConflict?.getParticipants() ?? [],
                effect: AbilityDsl.effects.cardCannot({
                    cannot: 'target',
                    restricts: 'eventPlayedByHigherBidPlayer'
                })
            })))
            .effect('prevent characters from being targeted by events played by players with a higher bid value than that of the character\'s controller');
    }
}


export default CulturedFacade;
