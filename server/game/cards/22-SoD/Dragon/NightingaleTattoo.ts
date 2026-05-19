import { Players, TargetModes, Locations, CardTypes } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class NightingaleTattoo extends DrawCard {
    static id = 'nightingale-tattoo';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            trait: 'monk'
        });

        this.whileAttached({
            effect: AbilityDsl.effects.addTrait('tattooed')
        });

        this.action({
            title: 'Pick two cards in your discard pile',
            target: {
                mode: TargetModes.Exactly,
                activePromptTitle: 'Choose two conflict cards',
                numCards: 2,
                location: Locations.ConflictDiscardPile,
                cardType: [CardTypes.Character, CardTypes.Attachment, CardTypes.Event],
                cardCondition: (card) => card.hasTrait('kiho') || card.hasTrait('tattoo'),
                controller: Players.Self,
                gameAction: AbilityDsl.actions.handler({
                    handler: (context) =>
                        this.game.promptWithHandlerMenu(context.player.opponent, {
                            activePromptTitle: 'Choose a card to shuffle into your opponent\'s deck',
                            context: context,
                            cards: context.target,
                            cardHandler: (selectedCard: DrawCard) => {
                                let removedCard = context.target.filter((a: DrawCard) => a !== selectedCard);
                                context.game.addMessage(
                                    '{0} chooses {1} to be shuffled into {2}\'s deck. {3} is removed from the game',
                                    context.player.opponent,
                                    selectedCard,
                                    context.player,
                                    removedCard
                                );

                                let gameAction = AbilityDsl.actions.multiple([
                                    AbilityDsl.actions.returnToDeck({
                                        target: selectedCard,
                                        location: Locations.ConflictDiscardPile,
                                        shuffle: true
                                    }),
                                    AbilityDsl.actions.removeFromGame({
                                        target: removedCard,
                                        location: Locations.ConflictDiscardPile
                                    })
                                ]);

                                gameAction.resolve(undefined, context);
                            }
                        })
                })
            },
            effect: 'have {1} shuffle one of {2} into {3}\'s conflict deck',
            effectArgs: (context) => [context.player.opponent, context.target, context.player]
        });
    }
}
