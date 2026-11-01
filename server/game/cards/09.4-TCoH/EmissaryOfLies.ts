import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { chooseAction, conditional, lookAt, multiple, nameCard, noAction, sendHome } from '../../GameActions/GameActions.js';
import { CardType, Players } from '../../Constants.js';

class EmissaryOfLies extends DrawCard {
    static id = 'emissary-of-lies';

    override setupCardAbilities() {
        this.action('Move a character home')
            .condition((context) => context.source.isParticipating())
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => card.isParticipating() && sendHome().canAffect(card, context)
            })
            .gameAction(nameCard((context) => ({
                player: Players.Opponent,
                message: (_context, cardName, player) => msg`${player} names ${cardName} - ${context.player} must choose if they want to reveal their hand`,
                gameAction: (cardName) => chooseAction({
                    activePromptTitle: 'Do you want to reveal your hand?',
                    waitingPromptTitle: 'Waiting for opponent to choose to reveal their hand or not',
                    choices: {
                        'Yes': multiple([
                            lookAt({
                                target: context.player.hand.slice().sort((a, b) => a.name.localeCompare(b.name))
                            }),
                            conditional({
                                condition: () => !context.player.hand.some((card) => card.name === cardName),
                                trueGameAction: sendHome({ target: context.target })
                            })
                        ]),
                        'No': noAction()
                    }
                })
            })));
    }
}

export default EmissaryOfLies;
