import { PlayType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';

export default class Infiltrator extends DrawCard {
    static id = 'infiltrator';

    setupCardAbilities() {
        this.action({
            title: 'Look at the top card of an opponent\'s deck and play or discard it',
            condition: () => this.game.isDuringConflict(),
            effect: 'look at the top card of an opponent\'s deck and play or discard it',
            gameAction: AbilityDsl.actions.chooseAction((context) => {
                const topCard = context.player.opponent?.conflictDeck[0];
                return {
                    activePromptTitle: topCard && 'Choose an action for ' + topCard.name,
                    options: {
                        'Play this card': {
                            action: AbilityDsl.actions.playCard({
                                target: topCard,
                                playType: PlayType.PlayFromHand,
                                source: this
                            })
                        },
                        'Discard this card': {
                            action: AbilityDsl.actions.discardCard({ target: topCard }),
                            message: '{0} chooses to discard {1}'
                        }
                    }
                };
            })
        });
    }

    canPlay(context: AbilityContext, playType: string) {
        if(!context.player.opponent || context.player.showBid <= context.player.opponent.showBid) {
            return false;
        }
        return super.canPlay(context, playType);
    }
}
