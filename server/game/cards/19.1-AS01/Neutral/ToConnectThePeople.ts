import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Location, Players, TargetMode } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { PlayCharacterAsIfFromHand } from '../../../PlayCharacterAsIfFromHand.js';
import { PlayDisguisedCharacterAsIfFromHand } from '../../../PlayDisguisedCharacterAsIfFromHand.js';

export default class ToConnectThePeople extends DrawCard {
    static id = 'to-connect-the-people';

    public setupCardAbilities() {
        this.action('Play a character from your opponent\'s discard pile')
            .condition((context) =>
                !context.game.isDuringConflict() &&
                context.player.cardsInPlay.some(
                    (card) => card.getType() === CardType.Character && card.hasTrait('merchant')
                ))
            .gameAction(AbilityDsl.actions.sequential([
                AbilityDsl.actions.discardCard((context) => ({
                    target: this.topThreeCards(context)
                })),
                AbilityDsl.actions.selectCard({
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    location: [Location.ConflictDiscardPile, Location.DynastyDiscardPile],
                    targets: true,
                    cardCondition: (card, context) => !card.isUnique() && card.glory <= this.maxMerchantGlory(context),
                    mode: TargetMode.Single,
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
            ]))
            .effect('discard {1} from the top of {2}\'s dynasty deck', (context) => [this.topThreeCards(context), context.player.opponent])
            .max(AbilityDsl.limit.perRound(1));
    }

    private topThreeCards(context: AbilityContext) {
        return context.player.opponent?.dynastyDeck.slice(0, 3) ?? [];
    }

    private maxMerchantGlory(context: AbilityContext) {
        return context.player.cardsInPlay.reduce(
            (maxGlory, card) =>
                card.getType() === CardType.Character && card.hasTrait('merchant') && card.glory > maxGlory
                    ? card.glory
                    : maxGlory,
            0
        );
    }
}
