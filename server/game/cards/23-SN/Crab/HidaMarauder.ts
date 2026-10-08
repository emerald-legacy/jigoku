import { msg } from '../../../GameChat.js';
import DrawCard from '../../../DrawCard.js';
import { multipleContext, reveal } from '../../../GameActions/GameActions.js';
import { chooseCardToDiscard, randomHandCards } from '../../randomHandCards.js';

export default class HidaMarauder extends DrawCard {
    static id = 'hida-marauder';

    setupCardAbilities() {
        this.reaction('Discard an opponent\'s card')
            .when({
                afterConflict: (event, context) => context.source.isParticipating() &&
                    event.conflict.winner === context.source.controller &&
                    context.player.opponent
            })
            .gameAction(multipleContext((context) => {
                const count = context.game.currentConflict?.getCharacters(context.player).length ?? 0;
                const cards = context.player.opponent && count > 0 ? randomHandCards(context.player.opponent, count) : [context.source];
                return {
                    gameActions: [
                        reveal({
                            target: cards,
                            chatMessage: true,
                            player: context.player.opponent
                        }),
                        chooseCardToDiscard(cards)
                    ]
                };
            }))
            .chatText((context) => msg`make ${context.player.opponent} reveal ${context.game.currentConflict?.getCharacters(context.player).length ?? 0} random card${(context.game.currentConflict?.getCharacters(context.player).length ?? 0) === 1 ? '' : 's'} from their hand`);
    }
}
