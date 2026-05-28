import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class VoidFist extends DrawCard {
    static id = 'void-fist';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Bow and send a character home',
            condition: context =>
                this.game.isDuringConflict() &&
                !!this.game.currentConflict &&
                this.game.currentConflict.getNumberOfCardsPlayed(context.player) >= 2,
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) =>
                    card.isParticipating() && !!this.game.currentConflict && this.game.currentConflict.getCharacters(context.player).some((myCard: DrawCard) =>
                        myCard.hasTrait('monk') && (myCard.militarySkill ?? 0) >= (card.militarySkill ?? 0)
                    ),
                gameAction: [ability.actions.bow(), ability.actions.sendHome()]
            },
            effect: 'bow {0} and send them home'
        });
    }
}


export default VoidFist;
