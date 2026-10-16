import DrawCard from '../../DrawCard.js';
import { CardType, Location } from '../../Constants.js';
import type Player from '../../Player.js';
import { ready } from '../../GameActions/GameActions.js';

class GaijinCustoms extends DrawCard {
    static id = 'gaijin-customs';

    override setupCardAbilities() {
        this.action('Ready a non-unicorn character')
            .condition((context) => this.controlsUnicornCard(context.player))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => !card.isFaction('unicorn')
            }, ready());
    }

    // in play: characters and attachments, the stronghold, faceup provinces and the holdings in them
    private controlsUnicornCard(player: Player): boolean {
        return this.game.allCards.some((card) => card.controller === player && card.isFaction('unicorn') && card.isFaceup() && (
            card.location === Location.PlayArea || card.type === CardType.Stronghold || card.isProvinceCard() ||
            (card.isInProvince() && card.type === CardType.Holding)
        ));
    }
}


export default GaijinCustoms;
