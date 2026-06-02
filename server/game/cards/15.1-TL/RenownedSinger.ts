import { CardType, Location, Players, TargetMode } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class RenownedSinger extends DrawCard {
    static id = 'renowned-singer';

    public setupCardAbilities() {
        this.action({
            title: 'Pick two cards in your discard pile',
            condition: (context) =>
                context.player.honorGained(context.game.roundNumber, this.game.currentPhase, true) >= 2 &&
                context.player.opponent !== undefined,
            target: {
                mode: TargetMode.Exactly,
                activePromptTitle: 'Choose two conflict cards',
                numCards: 2,
                location: Location.ConflictDiscardPile,
                cardType: [CardType.Character, CardType.Attachment, CardType.Event],
                controller: Players.Self,
                gameAction: AbilityDsl.actions.handler({
                    handler: (context) => {
                        const targets = context.targets.target as DrawCard[];
                        return this.game.promptWithHandlerMenu(context.player.opponent as any, {
                            activePromptTitle: 'Choose a card to add to your opponent\'s hand',
                            context: context,
                            cards: targets,
                            cardHandler: (handCard: DrawCard) => {
                                let bottomCard = targets.filter((a: DrawCard) => a !== handCard);
                                context.game.addMessage(
                                    '{0} chooses {1} to be put into {2}\'s hand. {3} is put on the bottom of {2}\'s conflict deck',
                                    context.player.opponent,
                                    handCard,
                                    context.player,
                                    bottomCard
                                );

                                let gameAction = AbilityDsl.actions.multiple([
                                    AbilityDsl.actions.moveCard({
                                        target: handCard,
                                        destination: Location.Hand
                                    }),
                                    AbilityDsl.actions.returnToDeck({
                                        target: bottomCard,
                                        location: Location.ConflictDiscardPile,
                                        bottom: true,
                                        shuffle: false
                                    })
                                ]);

                                gameAction.resolve(undefined, context);
                            }
                        });
                    }
                })
            },
            effect: 'have {1} return one of {2} to {3}\'s hand',
            effectArgs: (context) => [context.player.opponent as any, context.targets.target as DrawCard[], context.player]
        });
    }
}
