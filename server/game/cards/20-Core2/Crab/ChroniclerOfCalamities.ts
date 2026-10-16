import { msg } from '../../../GameChat.js';
import { CardType, Players } from '../../../Constants.js';
import { perConflict } from '../../../AbilityLimit.js';
import { dishonor, optional, sacrifice, selectCard, sendHome, sequential } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

const DISHONOR = 'Dishonor it';
const MOVE_HOME = 'Move it home';

export default class ChroniclerOfCalamities extends DrawCard {
    static id = 'chronicler-of-calamities';

    override setupCardAbilities() {
        this.conflictAction('Dishonor or move home a character')
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card !== context.source &&
                    card.isParticipating() &&
                    card.controller !== context.player &&
                    (context.game.currentConflict?.getCharacters(context.player) ?? [])
                        .some((myCard) => (myCard.printedCost ?? 0) >= (card.printedCost ?? 0))
            })
            .select({
                name: 'select',
                dependsOn: 'target'
            }, {
                [DISHONOR]: {
                    action: dishonor((context) => ({ target: context.target })),
                    chatText: 'dishonor {0}'
                },
                [MOVE_HOME]: {
                    action: sendHome((context) => ({ target: context.target })),
                    chatText: 'send {0} home'
                }
            })
            .gameAction(optional((context) => {
                const dishonorChosen = context.selects.select?.choice === DISHONOR;
                return {
                    activePromptTitle: dishonorChosen ? 'Sacrifice a character to also move it home?' : 'Sacrifice a character to also dishonor it?',
                    gameAction: sequential([
                        selectCard({
                            activePromptTitle: 'Select a character to sacrifice',
                            cardType: CardType.Character,
                            controller: Players.Self,
                            message: (context, card) => msg`${context.player} chooses to sacrifice ${card}`,
                            subActionProperties: (card) => ({ target: card, cannotBeCancelled: true }),
                            gameAction: sacrifice()
                        }),
                        dishonorChosen ? sendHome({ target: context.target }) : dishonor({ target: context.target })
                    ]),
                    acceptMessage: (context, chooser) => dishonorChosen
                        ? msg`${chooser} chooses to sacrifice a character to also send ${context.target} home`
                        : msg`${chooser} chooses to sacrifice a character to also dishonor ${context.target}`
                };
            }))
            .max(perConflict(1));
    }
}
