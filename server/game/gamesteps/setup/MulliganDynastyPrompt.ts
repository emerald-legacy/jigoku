import { msg, type MessageArgs } from '../../GameChat.js';
import { Location } from '../../Constants.js';
import type DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';
import { MulliganPrompt } from './MulliganPrompt.js';

export class MulliganDynastyPrompt extends MulliganPrompt {
    protected override readonly deckName = 'Dynasty';

    protected override hasDecided(player: Player): boolean {
        return player.takenDynastyMulligan;
    }

    protected override markDecided(player: Player): void {
        player.takenDynastyMulligan = true;
    }

    protected override mulliganableCards(player: Player): DrawCard[] {
        return this.game.getProvinceArray(false).map((location: string) => player.getDynastyCardsInProvince(location)).flat()
            .filter((card) => card.isDynasty && card.isInProvince());
    }

    protected override mulligan(player: Player, cards: DrawCard[]): MessageArgs {
        for(const card of cards) {
            if(player.dynastyDeck.length > 0) {
                player.moveCard(player.dynastyDeck[0], card.location);
            }
        }
        for(const card of cards) {
            const location = card.location;
            player.moveCard(card, Location.DynastyDeck, { bottom: true });
            player.replaceDynastyCard(location);
        }
        player.shuffleDynastyDeck();
        return msg`${player} has mulliganed ${cards.length} cards from the dynasty deck`;
    }

    protected override keptMessage(player: Player): MessageArgs {
        return msg`${player} has kept all dynasty cards`;
    }
}
