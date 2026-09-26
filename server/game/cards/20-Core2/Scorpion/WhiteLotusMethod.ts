import { CardType, CharacterStatus, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type { AbilityContext } from '../../../AbilityContext.js';

const TOKEN = 'token';
const RECIPIENT = 'recipient';

function doesCardDraw(context: AbilityContext) {
    return (context.targets[RECIPIENT] as DrawCard).controller !== context.source.controller;
}

export default class WhiteLotusMethod extends DrawCard {
    static id = 'white-lotus-method';

    setupCardAbilities() {
        this.action('Move a status token')
            .condition((context) => context.player.cardsInPlay.some((card: DrawCard) => card.hasTrait('courtier')))
            .tokenTarget(TOKEN, {
                activePromptTitle: 'Choose the status token to move',
                cardType: CardType.Character,
                tokenCondition: (token) => token.grantedStatus === CharacterStatus.Dishonored
            })
            .target(RECIPIENT, {
                activePromptTitle: 'Choose a Character to receive the token',
                dependsOn: TOKEN,
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.isOrdinary()
            }, AbilityDsl.actions.sequentialContext((context) => ({
                gameActions: [
                    AbilityDsl.actions.moveStatusToken({
                        target: context.tokens[TOKEN],
                        recipient: context.targets[RECIPIENT]
                    }),
                    AbilityDsl.actions.conditional({
                        condition: doesCardDraw,
                        trueGameAction: AbilityDsl.actions.draw((context) => ({
                            amount: 1,
                            target: (context.targets[RECIPIENT] as DrawCard).controller
                        })),
                        falseGameAction: AbilityDsl.actions.noAction()
                    })
                ]
            })))
            .effect('move a status token to {1}{2}', (context) => [
                context.targets[RECIPIENT],
                doesCardDraw(context) ? ', their controller draws a card' : ''
            ]);
    }
}
