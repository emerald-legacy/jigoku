import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class FireElementalGuard extends DrawCard {
    static id = 'fire-elemental-guard';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Discard an attachment',
            condition: context =>
                this.game.isDuringConflict() &&
                (this.game.currentConflict?.getNumberOfCardsPlayed(context.player, (card: any) => card.hasTrait('spell')) ?? 0) > 2,
            target: {
                cardType: CardType.Attachment,
                gameAction: ability.actions.discardFromPlay()
            }
        });
    }
}


export default FireElementalGuard;
