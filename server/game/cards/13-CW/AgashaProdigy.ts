import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, CardType, EventName } from '../../Constants.js';
import { honorTransferMessage } from '../honorTransferMessage.js';

class AgashaProdigys extends DrawCard {
    static id = 'agasha-prodigy';

    setupCardAbilities() {
        this.action('Discard a card to try and attach it to a character')
            .cost(AbilityDsl.costs.optionalHonorTransferFromOpponentCost((context) => !!context.player.opponent && context.player.opponent.conflictDeck.length > 0))
            .target({
                name: 'myCharacter',
                cardType: CardType.Character
            }, AbilityDsl.actions.sequential([
                AbilityDsl.actions.discardCard(context => ({
                    target: context.player.conflictDeck[0]
                })),
                AbilityDsl.actions.ifAble(context => ({
                    ifAbleAction: AbilityDsl.actions.attach({
                        target: context.targets.myCharacter,
                        attachment: this.getDiscardedCards(context)[0]
                    }),
                    otherwiseAction: AbilityDsl.actions.discardFromPlay({ target: [] })
                }))
            ]))
            .target({
                name: 'oppCharacter',
                player: Players.Opponent,
                cardType: CardType.Character,
                optional: true,
                hideIfNoLegalTargets: true,
                cardCondition: (card, context) => Boolean(context.costs.optionalHonorTransferFromOpponentCostPaid)
            }, AbilityDsl.actions.sequential([
                AbilityDsl.actions.discardCard(context => ({
                    target: this.oppCharacterChosen(context) ? context.player.opponent?.conflictDeck[0] : []
                })),
                AbilityDsl.actions.ifAble(context => ({
                    ifAbleAction: AbilityDsl.actions.attach({
                        target: context.targets.oppCharacter,
                        attachment: this.getDiscardedCards(context)[1]
                    }),
                    otherwiseAction: AbilityDsl.actions.discardFromPlay({ target: [] })
                }))
            ]))
            .effect('discard the top card of their deck and attempt to attach it to {1}{2}', (context) => [
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
