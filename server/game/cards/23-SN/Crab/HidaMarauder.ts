import { msg } from '../../../GameChat.js';
import DrawCard from '../../../DrawCard.js';
import { multiple, reveal } from '../../../GameActions/GameActions.js';
import { chooseCardToDiscard, randomHandCards } from '../../randomHandCards.js';

export default class HidaMarauder extends DrawCard {
    static id = 'hida-marauder';

    override setupCardAbilities() {
        this.reaction('Discard an opponent\'s card')
            .when({
                afterConflict: (event, context) => event.conflict.isOnWinningSide(context.source) &&
                    context.player.opponent
            })
            .gameAction(multiple((context) => {
                const count = context.game.currentConflict?.getCharacters(context.player).length ?? 0;
                const cards = context.player.opponent && count > 0 ? randomHandCards(context.player.opponent, count) : [];
                return [
                    reveal({
                        target: cards,
                        chatMessage: true,
                        player: context.player.opponent
                    }),
                    chooseCardToDiscard(cards)
                ];
            }))
            .chatText((context) => {
                const amount = Math.min(context.game.currentConflict?.getCharacters(context.player).length ?? 0, context.player.opponent?.hand.length ?? 0);
                return msg`make ${context.player.opponent} reveal ${amount} random card${amount === 1 ? '' : 's'} from their hand`;
            });
    }
}
