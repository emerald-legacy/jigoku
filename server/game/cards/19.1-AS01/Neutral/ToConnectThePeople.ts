import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import { CardTypes, Locations, Players, TargetModes } from '../../../Constants.js';
import DrawCard from '../../../drawcard.js';
import { PlayCharacterAsIfFromHand } from '../../../PlayCharacterAsIfFromHand.js';
import { PlayDisguisedCharacterAsIfFromHand } from '../../../PlayDisguisedCharacterAsIfFromHand.js';

export default class ToConnectThePeople extends DrawCard {
    static id = 'to-connect-the-people';

    public setupCardAbilities() {
        this.action({
            title: 'Play a character from your opponent\'s discard pile',
            condition: (context) =>
                !context.game.isDuringConflict() &&
                (context.player.cardsInPlay as DrawCard[]).some(
                    (card) => card.getType() === CardTypes.Character && card.hasTrait('merchant')
                ),
            effect: 'discard the top 3 cards of {1}\'s dynasty deck',
            effectArgs: (context) => [context.player.opponent as any],
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.handler({
                    handler: (context) => {
                        const cards = context.player.opponent?.dynastyDeck.slice(0, 3) ?? [];
                        for(const card of cards) {
                            const destination = card.isDynasty
                                ? Locations.DynastyDiscardPile
                                : Locations.ConflictDiscardPile;
                            card.controller.moveCard(card, destination);
                        }
                        if(cards.length > 0) {
                            context.game.addMessage('{0} discards {1}', context.source, cards);
                        }
                    }
                }),
                AbilityDsl.actions.selectCard({
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    location: [Locations.ConflictDiscardPile, Locations.DynastyDiscardPile],
                    targets: true,
                    cardCondition: (card, context) => !card.isUnique() && card.glory <= this.maxMerchantGlory(context),
                    mode: TargetModes.Single,
                    gameAction: AbilityDsl.actions.sequential([
                        AbilityDsl.actions.cardLastingEffect({
                            effect: [
                                AbilityDsl.effects.gainPlayAction(PlayCharacterAsIfFromHand),
                                AbilityDsl.effects.gainPlayAction(PlayDisguisedCharacterAsIfFromHand)
                            ]
                        }),
                        AbilityDsl.actions.playCard({ ignoredRequirements: ['location'] })
                    ])
                })
            ]),
            max: AbilityDsl.limit.perRound(1)
        });
    }

    private maxMerchantGlory(context: AbilityContext) {
        return (context.player.cardsInPlay as DrawCard[]).reduce(
            (maxGlory, card) =>
                card.getType() === CardTypes.Character && card.hasTrait('merchant') && card.glory > maxGlory
                    ? card.glory
                    : maxGlory,
            0
        );
    }
}
