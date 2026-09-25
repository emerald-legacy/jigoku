import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class HitsuDoDisciple extends DrawCard {
    static id = 'hitsu-do-disciple';

    setupCardAbilities() {
        this.action('Dishonor a character')
            .condition(context => context.source.game.isDuringConflict('military') &&
                context.source.isParticipating() &&
                (this.game.currentConflict?.getNumberOfCardsPlayed(context.player) ?? 0) >= 3)
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isParticipating() && card !== context.source
            }, AbilityDsl.actions.dishonor());
    }
}


export default HitsuDoDisciple;
