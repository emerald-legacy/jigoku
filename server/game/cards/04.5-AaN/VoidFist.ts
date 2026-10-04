import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class VoidFist extends DrawCard {
    static id = 'void-fist';

    setupCardAbilities() {
        this.action('Bow and send a character home')
            .condition(context =>
                !!this.game.currentConflict &&
                this.game.currentConflict.getNumberOfCardsPlayed(context.player) >= 2)
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card.isParticipating() && !!this.game.currentConflict && this.game.currentConflict.getCharacters(context.player).some((myCard) =>
                        myCard.hasTrait('monk') && myCard.militarySkill >= card.militarySkill
                    )
            }, AbilityDsl.actions.bow(), AbilityDsl.actions.sendHome())
            .effect('bow {0} and send them home');
    }
}


export default VoidFist;
