import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

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

    selectCardName(player: any, cardName: any, context: any) {
        this.game.addMessage('{0} names {1} - {2} must choose if they want to reveal their hand', player, cardName, player.opponent);
        let opponent = player.opponent;
        this.game.promptWithHandlerMenu(context.player, {
            context: context,
            choices: ['Yes', 'No'],
            handlers: [() => {
                let handCardNames = opponent.hand.map((card: any) => card.name);
                this.game.actions.lookAt().resolve(opponent.hand.slice().sort((a: any, b: any) => a.name.localeCompare(b.name)), context);
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
