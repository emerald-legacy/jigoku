import { msg } from '../../GameChat.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { CardType, EventName, Location } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import * as GameActions from '../../GameActions/GameActions.js';
import type { HandlerMenuOption } from '../../gamesteps/HandlerMenuPrompt.js';
import { controlsShugenja } from '../controlsShugenja.js';

class ConsumedByFiveFires extends DrawCard {
    static id = 'consumed-by-five-fires';

    setupCardAbilities() {
        this.action('Remove up to 5 fate from characters')
            .condition((context) =>
                controlsShugenja(context.player) &&
                !!context.player.opponent &&
                context.player.opponent.cardsInPlay.some((card) => card.allowGameAction('removeFate', context)))
            .handler((context) => this.chooseCard(context, {}, []))
            .chatText((context) => msg`remove fate from ${context.player.opponent}'s characters`);
    }

    private chooseCard(context: AbilityContext, targets: Record<string, number>, messages: string[]) {
        const fateRemaining = 5 - Object.values(targets).reduce((totalFate: number, fateToRemove: number) => totalFate + fateToRemove, 0);
        if(!context.player.opponent) {
            return;
        }
        const opponent = context.player.opponent;
        if(fateRemaining === 0 || !opponent.cardsInPlay.some((card) => card.allowGameAction('removeFate', context) && !Object.keys(targets).includes(card.uuid))) {
            this.game.addMessage(msg`${context.player} chooses to: ${messages}`);
            const keys = Object.keys(targets);
            const events = keys.map((key) => {
                const card = opponent.cardsInPlay.find((c) => c.uuid === key);
                if(card) {
                    return GameActions.removeFate({ amount: targets[key] }).getEvent(card, context);
                }
                return undefined;
            }).filter((obj): obj is NonNullable<typeof obj> => !!obj);
            this.game.openThenEventWindow(events);
            return;
        }
        this.game.promptForSelect(context.player, {
            context: context,
            cardType: CardType.Character,
            cardCondition: (card) => card.location === Location.PlayArea && card.allowGameAction('removeFate', context) && card.controller !== context.player && !Object.keys(targets).includes(card.uuid),
            onSelect: (player, card) => {
                const maxFate = Math.min(fateRemaining, card.getFate());
                const amounts = Array.from({ length: maxFate }, (_, i) => i + 1);
                const options: HandlerMenuOption[] = amounts.map((choice) => ({
                    text: choice.toString(),
                    handler: () => {
                        targets[card.uuid] = choice;
                        messages.push('take ' + choice.toString() + ' fate from ' + card.name);
                        this.chooseCard(context, targets, messages);
                    }
                }));
                options.push({ text: 'Redo', handler: () => this.chooseCard(context, {}, []) });
                this.game.promptWithHandlerMenu(player, {
                    activePromptTitle: 'How much fate do you want to remove?',
                    options,
                    context: context
                });
                return true;
            },
            onCancel: () => {
                this.game.addMessage(msg`${context.player} chooses to: ${messages}`);
                const keys = Object.keys(targets);
                const events = this.game.applyGameAction(context, { removeFate: opponent.cardsInPlay.filter((card) => keys.includes(card.uuid)) });
                events.forEach((event) => {
                    if(event.is(EventName.OnMoveFate) && event.card) {
                        event.fate = targets[event.card.uuid];
                    }
                });
                return true;
            }
        });
    }
}


export default ConsumedByFiveFires;
