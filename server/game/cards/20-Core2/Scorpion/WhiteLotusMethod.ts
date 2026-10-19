import { msg } from '../../../GameChat.js';
import { CardType, CharacterStatus, Players, Trait } from '../../../Constants.js';
import { conditional, draw, moveStatusToken, sequential } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

const TOKEN = 'token';
const RECIPIENT = 'recipient';

function doesCardDraw(recipient: DrawCard, source: DrawCard) {
    return recipient.controller !== source.controller;
}

export default class WhiteLotusMethod extends DrawCard {
    static id = 'white-lotus-method';

    override setupCardAbilities() {
        this.action('Move a status token')
            .ifCondition((context) => context.player.cardsInPlay.some((card) => card.hasTrait(Trait.Courtier)))
            .tokenTarget({
                name: TOKEN,
                activePromptTitle: 'Choose the status token to move',
                cardType: CardType.Character,
                controller: Players.Self,
                tokenCondition: (token) => token.grantedStatus === CharacterStatus.Dishonored
            })
            .target({
                name: RECIPIENT,
                activePromptTitle: 'Choose a Character to receive the token',
                dependsOn: TOKEN,
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.isOrdinary()
            }, sequential((context) => [
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
            ]))
            .chatText((context) => msg`move a status token to ${context.targets[RECIPIENT]}${doesCardDraw(context.targets[RECIPIENT], context.source) ? ', their controller draws a card' : ''}`);
    }
}
