import DrawCard from '../../DrawCard.js';
import { CardType, ConflictType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class HitsuDoDisciple extends DrawCard {
    static id = 'hitsu-do-disciple';

    setupCardAbilities() {
        this.action('Dishonor a character')
            .condition(context => context.game.isDuringConflict(ConflictType.Military) &&
                context.source.isParticipating() &&
                (this.game.currentConflict?.getNumberOfCardsPlayed(context.player) ?? 0) >= 3)
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isParticipating() && card !== context.source
            }, AbilityDsl.actions.dishonor());
    }
}


export default HitsuDoDisciple;
