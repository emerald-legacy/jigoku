import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import type { Event } from '../../Events/Event.js';
import type { EventPayload } from '../../Events/EventPayloads.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, CardType, EventName } from '../../Constants.js';

class AgashaProdigys extends DrawCard {
    static id = 'agasha-prodigy';

    setupCardAbilities() {
        this.action({
            title: 'Discard a card to try and attach it to a character',
            cost: AbilityDsl.costs.optionalHonorTransferFromOpponentCost((context) => {
                return context.player.opponent !== null && context.player.opponent !== undefined && context.player.opponent.conflictDeck.length > 0;
            }),
            targets: {
                myCharacter: {
                    cardType: CardType.Character,
                    gameAction: AbilityDsl.actions.sequential([
                        AbilityDsl.actions.discardCard(context => ({
                            target: context.player.conflictDeck[0]
                        })),
                        AbilityDsl.actions.ifAble(context => ({
                            ifAbleAction: AbilityDsl.actions.attach({
                                target: context.targets.myCharacter,
                                attachment: this.getDiscardedCards(context).length > 0 ? this.getDiscardedCards(context)[0] : undefined
                            }),
                            otherwiseAction: AbilityDsl.actions.discardFromPlay({ target: [] })
                        }))
                    ])
                },
                oppCharacter: {
                    player: Players.Opponent,
                    cardType: CardType.Character,
                    optional: true,
                    hideIfNoLegalTargets: true,
                    cardCondition: (card, context) => Boolean(context.costs.optionalHonorTransferFromOpponentCostPaid),
                    gameAction: AbilityDsl.actions.sequential([
                        AbilityDsl.actions.discardCard(context => ({
                            target: context.targets.oppCharacter ? context.player.opponent.conflictDeck[0] : []
                        })),
                        AbilityDsl.actions.ifAble(context => ({
                            ifAbleAction: AbilityDsl.actions.attach({
                                target: context.targets.oppCharacter,
                                attachment: this.getDiscardedCards(context).length > 1 ? this.getDiscardedCards(context)[1] : undefined
                            }),
                            otherwiseAction: AbilityDsl.actions.discardFromPlay({ target: [] })
                        }))
                    ])
                }
            },
            effect: 'discard the top card of their deck and attempt to attach it to {1}{2}',
            effectArgs: context => [context.targets.myCharacter, this.buildString(context)]
        });
    }

    getDiscardedCards(context: AbilityContext) {
        let events = context.events.filter((event: Event) => event.name === EventName.OnCardsDiscarded);
        if(events.length > 0) {
            let cards: DrawCard[] = [];
            events.forEach((a: Event) => cards = cards.concat(((a as Event & EventPayload<EventName.OnCardsDiscarded>).cards ?? []) as DrawCard[]));
            return cards;
        }

        return [];
    }

    buildString(context: AbilityContext) {
        if(context.targets.oppCharacter && !Array.isArray(context.targets.oppCharacter) && context.player.opponent) {
            let target = context.targets.oppCharacter;
            return '.  ' + context.player.opponent.name + ' gives ' + context.player.name + ' 1 honor to discard the top card of their deck and attempt to attach it to ' + target.name;
        }
        return '';
    }
}


export default AgashaProdigys;
