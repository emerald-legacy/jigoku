import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class HitsuDoDisciple extends DrawCard {
    static id = 'hitsu-do-disciple';

    setupCardAbilities() {
        this.action({
            title: 'Dishonor a character',
            condition: context => context.source.game.isDuringConflict('military') &&
                context.source.isParticipating() &&
                this.game.currentConflict.getNumberOfCardsPlayed(context.player) >= 3,
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.isParticipating() && card !== context.source,
                gameAction: AbilityDsl.actions.dishonor()
            }
        });
    }
}


export default HitsuDoDisciple;
