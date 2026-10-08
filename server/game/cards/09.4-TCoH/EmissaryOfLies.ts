import DrawCard from '../../DrawCard.js';
import { chooseAction, conditional, lookAt, multiple, noAction, sendHome } from '../../GameActions/GameActions.js';
import { CardType, Players } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type Player from '../../Player.js';

class EmissaryOfLies extends DrawCard {
    static id = 'emissary-of-lies';

    setupCardAbilities() {
        this.action('Move a character home')
            .condition((context) => context.source.isParticipating())
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            })
            .handler((context) => {
                const opponent = context.player.opponent;
                if(!opponent) {
                    return;
                }
                this.game.promptWithMenu(opponent, {
                    selectCardName: (player: Player, cardName: string) => {
                        this.game.addMessage('{0} names {1} - {2} must choose if they want to reveal their hand', player, cardName, context.player);
                        this.offerToRevealHand(context, context.target, cardName);
                        return true;
                    }
                }, {
                    context: context,
                    activePrompt: {
                        menuTitle: 'Name a card',
                        controls: [
                            { type: 'card-name', command: 'menuButton', method: 'selectCardName', name: 'card-name' }
                        ]
                    }
                });
            });
    }

    private offerToRevealHand(context: AbilityContext, character: DrawCard, cardName: string) {
        chooseAction({
            activePromptTitle: 'Do you want to reveal your hand?',
            waitingPromptTitle: 'Waiting for opponent to choose to reveal their hand or not',
            options: {
                'Yes': {
                    action: multiple([
                        lookAt({
                            target: context.player.hand.slice().sort((a, b) => a.name.localeCompare(b.name))
                        }),
                        conditional({
                            condition: () => !context.player.hand.some((card) => card.name === cardName),
                            trueGameAction: sendHome({ target: character })
                        })
                    ])
                },
                'No': { action: noAction() }
            }
        }).resolve(undefined, context);
    }
}

export default EmissaryOfLies;
