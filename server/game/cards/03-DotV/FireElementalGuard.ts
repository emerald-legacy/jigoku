import DrawCard from '../../DrawCard.js';
import { CardType, Trait } from '../../Constants.js';
import { discardFromPlay } from '../../GameActions/GameActions.js';

class FireElementalGuard extends DrawCard {
    static id = 'fire-elemental-guard';

    setupCardAbilities() {
        this.action('Discard an attachment')
            .condition((context) =>
                (this.game.currentConflict?.getNumberOfCardsPlayed(context.player, (card) => card.hasTrait(Trait.Spell)) ?? 0) > 2)
            .target({
                cardType: CardType.Attachment
            }, discardFromPlay());
    }
}


export default FireElementalGuard;
