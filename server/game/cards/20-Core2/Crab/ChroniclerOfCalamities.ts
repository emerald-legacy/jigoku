import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import { GameAction } from '../../../GameActions/GameAction.js';

export default class ChroniclerOfCalamities extends DrawCard {
    static id = 'chronicler-of-calamities';

    setupCardAbilities() {
        this.action<DrawCard>({
            title: 'Dishonor or move home a character',
            condition: (context) => context.source.isParticipating(),
            effect: 'dishonor or send home {0}',
            effectArgs: (context) => [
                context.target?.isFacedown() ? 'a facedown card' : (context.target ?? ''),
                context.target?.location ?? ''
            ],
            target: {
                cardType: CardType.Character,
                cardCondition: (card: DrawCard, context) =>
                    card !== context.source &&
                    card.isParticipating() &&
                    card.controller !== context.player &&
                    (context.game.currentConflict?.getCharacters(context.player) ?? [])
                        .some((myCard: any) => (myCard.printedCost ?? 0) >= (card.printedCost ?? 0)),
                gameAction: AbilityDsl.actions.chooseAction((context) => ({
                    activePromptTitle: 'Select one',
                    options: {
                        'Dishonor it': {
                            action: AbilityDsl.actions.dishonor({ target: context.target }),
                            message: '{0} chooses to dishonor {1}'
                        },
                        'Move it home': {
                            action: AbilityDsl.actions.sendHome({ target: context.target }),
                            message: '{0} chooses to send {1} home'
                        },
                        'Sacrifice a character to perform both': {
                            action: AbilityDsl.actions.sequentialContext((context) => {
                                const gameActions: GameAction[] = [AbilityDsl.actions.sendHome()];
                                gameActions.push(
                                    AbilityDsl.actions.selectCard({
                                        activePromptTitle: 'Select a character to sacrifice',
                                        cardType: CardType.Character,
                                        controller: Players.Self,
                                        message: '{0} chooses to sacrifice {1}',
                                        messageArgs: (card) => [context.player, card],
                                        subActionProperties: (card) => ({ target: card, cannotBeCancelled: true }),
                                        gameAction: AbilityDsl.actions.sacrifice()
                                    })
                                );
                                gameActions.push(AbilityDsl.actions.dishonor({ target: context.target }));
                                gameActions.push(AbilityDsl.actions.sendHome({ target: context.target }));

                                return { gameActions };
                            }),
                            message: '{0} chooses to sacrifice a character to both dishonor and send {1} home'
                        }
                    }
                }))
            },
            max: AbilityDsl.limit.perConflict(1)
        });
    }
}
