import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { attach, discardCard, discardFromPlay, ifAble, sequential } from '../../GameActions/GameActions.js';
import { Players, CardType, EventName } from '../../Constants.js';
import { honorTransferMessage } from '../honorTransferMessage.js';

class AgashaProdigys extends DrawCard {
    static id = 'agasha-prodigy';

    setupCardAbilities() {
        this.action('Discard a card to try and attach it to a character')
            .cost(costs.optionalTakeHonorFromOpponent((context) => !!context.player.opponent && context.player.opponent.conflictDeck.length > 0))
            .target({
                name: 'myCharacter',
                cardType: CardType.Character
            }, sequential([
                discardCard(context => ({
                    target: context.player.conflictDeck[0]
                })),
                ifAble(context => ({
                    ifAbleAction: attach({
                        target: context.targets.myCharacter,
                        attachment: this.getDiscardedCards(context)[0]
                    }),
                    otherwiseAction: discardFromPlay({ target: [] })
                }))
            ]))
            .target({
                name: 'oppCharacter',
                player: Players.Opponent,
                cardType: CardType.Character,
                optional: true,
                hideIfNoLegalTargets: true,
                cardCondition: (_card, context) => Boolean(context.costs.honorTakenFromOpponent)
            }, sequential([
                discardCard(context => ({
                    target: this.oppCharacterChosen(context) ? context.player.opponent?.conflictDeck[0] : []
                })),
                ifAble(context => ({
                    ifAbleAction: attach({
                        target: context.targets.oppCharacter,
                        attachment: this.getDiscardedCards(context)[1]
                    }),
                    otherwiseAction: discardFromPlay({ target: [] })
                }))
            ]))
            .chatText('discard the top card of their deck and attempt to attach it to {1}{2}', (context) => [
                context.targets.myCharacter,
                honorTransferMessage(context, context.targets.oppCharacter, (name) => 'discard the top card of their deck and attempt to attach it to ' + name)
            ]);
    }

    private oppCharacterChosen(context: AbilityContext): boolean {
        const chosen = context.targets.oppCharacter;
        return !!chosen && !Array.isArray(chosen);
    }

    private getDiscardedCards(context: AbilityContext) {
        return context.events.flatMap((event) => event.is(EventName.OnCardsDiscarded) ? event.cards : []);
    }
}


export default AgashaProdigys;
