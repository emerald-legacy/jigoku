import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import type Player from '../../Player.js';
import type { AbilityContext } from '../../AbilityContext.js';

class EmissaryOfLies extends DrawCard {
    static id = 'emissary-of-lies';

    setupCardAbilities() {
        this.action({
            title: 'Move a character home',
            condition: context => context.source.isParticipating(),
            target: {
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isParticipating() && card.controller === context.player.opponent
            },
            handler: (context) => {
                if(!context || !context.player.opponent) {
                    return;
                }
                this.game.promptWithMenu(context.player.opponent, this, {
                    context: context,
                    activePrompt: {
                        menuTitle: 'Name a card',
                        controls: [
                            { type: 'card-name', command: 'menuButton', method: 'selectCardName', name: 'card-name' }
                        ]
                    }
                });
            }
        });
    }

    selectCardName(player: Player, cardName: string, context: AbilityContext) {
        this.game.addMessage('{0} names {1} - {2} must choose if they want to reveal their hand', player, cardName, player.opponent);
        let opponent = player.opponent as Player;
        this.game.promptWithHandlerMenu(context.player, {
            context: context,
            choices: ['Yes', 'No'],
            handlers: [() => {
                let handCardNames = opponent.hand.map((card: DrawCard) => card.name);
                this.game.actions.lookAt().resolve(opponent.hand.slice().sort((a: DrawCard, b: DrawCard) => a.name.localeCompare(b.name)), context);
                if(!handCardNames.includes(cardName)) {
                    this.game.actions.sendHome().resolve(context.target, context);
                    return true;
                }
                return true;
            }, () => true],
            activePromptTitle: 'Do you want to reveal your hand?',
            waitingPromptTitle: 'Waiting for opponent to choose to reveal their hand or not'
        });
        return true;
    }
}

export default EmissaryOfLies;
