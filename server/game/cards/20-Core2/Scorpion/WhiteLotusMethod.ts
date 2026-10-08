import { msg } from '../../../GameChat.js';
import { CardType, CharacterStatus, Players } from '../../../Constants.js';
import { conditional, draw, moveStatusToken, sequentialContext } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

const TOKEN = 'token';
const RECIPIENT = 'recipient';

function doesCardDraw(recipient: DrawCard, source: DrawCard) {
    return recipient.controller !== source.controller;
}

export default class WhiteLotusMethod extends DrawCard {
    static id = 'white-lotus-method';

    setupCardAbilities() {
        this.action('Move a status token')
            .condition((context) => context.player.cardsInPlay.some((card) => card.hasTrait('courtier')))
            .tokenTarget({
                name: TOKEN,
                activePromptTitle: 'Choose the status token to move',
                cardType: CardType.Character,
                tokenCondition: (token) => token.grantedStatus === CharacterStatus.Dishonored
            })
            .target({
                name: RECIPIENT,
                activePromptTitle: 'Choose a Character to receive the token',
                dependsOn: TOKEN,
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.isOrdinary()
            }, sequentialContext((context) => ({
                gameActions: [
                    moveStatusToken({
                        target: context.tokens[TOKEN],
                        recipient: context.targets[RECIPIENT]
                    }),
                    conditional({
                        condition: () => doesCardDraw(context.targets[RECIPIENT], context.source),
                        trueGameAction: draw({
                            target: context.targets[RECIPIENT].controller
                        })
                    })
                ]
            })))
            .chatText((context) => msg`move a status token to ${context.targets[RECIPIENT]}${doesCardDraw(context.targets[RECIPIENT], context.source) ? ', their controller draws a card' : ''}`);
    }
}
