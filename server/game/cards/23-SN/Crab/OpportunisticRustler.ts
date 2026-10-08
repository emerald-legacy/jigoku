import DrawCard from '../../../DrawCard.js';
import { modifyMilitarySkill } from '../../../effects.js';
import { cardLastingEffect, moveCard, multipleContext, noAction } from '../../../GameActions/GameActions.js';
import { ConflictType, Decks, Location } from '../../../Constants.js';
import type { GameAction } from '../../../GameActions/GameAction.js';
import { msg } from '../../../GameChat.js';

export default class OpportunisticRustler extends DrawCard {
    static id = 'opportunistic-rustler';

    setupCardAbilities() {
        this.reaction('Look at your opponent\'s dynasty deck')
            .when({
                onConflictDeclared: (event, context) => event.attackers?.includes(context.source) && event.conflict.conflictType === ConflictType.Military
            })
            .deckSearch(context => ({
                cardsToLookAt: (context) => context.game.currentConflict?.declaredProvince?.printedStrength || 1,
                player: context.player.opponent,
                choosingPlayer: context.player,
                deck: Decks.DynastyDeck,
                placeOnBottomInRandomOrder: true,
                shuffle: false,
                // [player] puts [card] faceup into the attacked province and gives [source] +XMIL
                // [player] removes [card] from the game and gives [source] +XMIL
                message: '{0} {1} {2} {3} {4} +{5}{6}',
                messageArgs: (context, cards) => cards[0].hasTrait('cavalry') ?
                    [context.player, 'removes', cards, 'from the game and gives', context.source, cards[0].getTraits().size, 'military'] :
                    [context.player, 'puts', cards, 'faceup into the attacked province and gives', context.source, cards[0].getTraits().size, 'military'],
                gameAction: multipleContext((context) => {
                    const selected = context.deckSearchSelected[0];
                    if(!selected || !context.game.currentConflict) {
                        return { gameActions: [noAction()] };
                    }
                    const numberOfTraits = selected.getTraits().size;

                    const gameActions: Array<GameAction> = [];
                    gameActions.push(cardLastingEffect(context => ({
                        target: context.source,
                        effect: modifyMilitarySkill(numberOfTraits)
                    })));

                    if(selected.hasTrait('cavalry')) {
                        gameActions.push(moveCard({ target: selected, destination: Location.RemovedFromGame }));
                    } else {
                        gameActions.push(moveCard({ target: selected, faceup: true, destination: context.game.currentConflict.declaredProvince?.location }));
                    }

                    return { gameActions };
                })
            }))
            .effect((context) => msg`look at ${context.player.opponent}'s dynasty deck`);
    }
}
