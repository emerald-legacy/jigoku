import { Players, TargetMode, Location, CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

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

        this.action('Pick two cards in your discard pile')
            .targetCards('target', {
                mode: TargetMode.Exactly,
                activePromptTitle: 'Choose two conflict cards',
                numCards: 2,
                location: Location.ConflictDiscardPile,
                cardType: [CardType.Character, CardType.Attachment, CardType.Event],
                cardCondition: (card) => card.hasTrait('kiho') || card.hasTrait('tattoo'),
                controller: Players.Self
            }, AbilityDsl.actions.handler({
                handler: (context) => {
                    const targets = context.targets.target;
                    const opponent = context.player.opponent;
                    if(!opponent || !Array.isArray(targets)) {
                        return;
                    }
                    this.game.promptWithHandlerMenu(opponent, {
                        activePromptTitle: 'Choose a card to shuffle into your opponent\'s deck',
                        context: context,
                        cards: targets,
                        cardHandler: (selectedCard: DrawCard) => {
                            let removedCard = targets.filter((a) => a !== selectedCard);
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
                                    location: Location.ConflictDiscardPile,
                                    shuffle: true
                                }),
                                AbilityDsl.actions.removeFromGame({
                                    target: removedCard,
                                    location: Location.ConflictDiscardPile
                                })
                            ]);

                            gameAction.resolve(undefined, context);
                        }
                    });
                }
            }))
            .effect('have {1} shuffle one of {2} into {3}\'s conflict deck', (context) => [context.player.opponent, context.targets.target, context.player]);
    }
}
