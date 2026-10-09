import { msg } from '../../../GameChat.js';
import { CardType, Players } from '../../../Constants.js';
import { perConflict } from '../../../AbilityLimit.js';
import {
    chooseAction,
    dishonor,
    sacrifice,
    selectCard,
    sendHome,
    sequentialContext
} from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import type { GameAction } from '../../../GameActions/GameAction.js';

export default class ChroniclerOfCalamities extends DrawCard {
    static id = 'chronicler-of-calamities';

    setupCardAbilities() {
        this.conflictAction('Dishonor or move home a character')
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card !== context.source &&
                    card.isParticipating() &&
                    card.controller !== context.player &&
                    (context.game.currentConflict?.getCharacters(context.player) ?? [])
                        .some((myCard) => (myCard.printedCost ?? 0) >= (card.printedCost ?? 0))
            }, chooseAction((context) => ({
                activePromptTitle: 'Select one',
                choices: {
                    'Dishonor it': {
                        action: dishonor({ target: context.target }),
                        message: (_context, target, player) => msg`${player} chooses to dishonor ${target}`
                    },
                    'Move it home': {
                        action: sendHome({ target: context.target }),
                        message: (_context, target, player) => msg`${player} chooses to send ${target} home`
                    },
                    'Sacrifice a character to perform both': {
                        action: sequentialContext((context) => {
                            const gameActions: GameAction[] = [sendHome()];
                            gameActions.push(
                                selectCard({
                                    activePromptTitle: 'Select a character to sacrifice',
                                    cardType: CardType.Character,
                                    controller: Players.Self,
                                    message: (context, card) => msg`${context.player} chooses to sacrifice ${card}`,
                                    subActionProperties: (card) => ({ target: card, cannotBeCancelled: true }),
                                    gameAction: sacrifice()
                                })
                            );
                            gameActions.push(dishonor({ target: context.target }));
                            gameActions.push(sendHome({ target: context.target }));

                            return { gameActions };
                        }),
                        message: (_context, target, player) => msg`${player} chooses to sacrifice a character to both dishonor and send ${target} home`
                    }
                }
            })))
            .chatText('dishonor or send home {0}')
            .max(perConflict(1));
    }
}
