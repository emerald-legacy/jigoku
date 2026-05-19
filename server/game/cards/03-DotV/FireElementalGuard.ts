import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class FireElementalGuard extends DrawCard {
    static id = 'fire-elemental-guard';

    setupCardAbilities(ability) {
        this.action({
            title: 'Discard an attachment',
            condition: context =>
                this.game.isDuringConflict() &&
                this.game.currentConflict.getNumberOfCardsPlayed(context.player, card => card.hasTrait('spell')) > 2,
            target: {
                cardType: CardTypes.Attachment,
                gameAction: ability.actions.discardFromPlay()
            }
        });
    }
}


export default FireElementalGuard;
