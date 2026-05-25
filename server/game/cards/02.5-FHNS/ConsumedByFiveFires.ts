import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../basecard.js';
import { CardTypes, Locations } from '../../Constants.js';
import DrawCard from '../../drawcard.js';
import type { Event } from '../../Events/Event.js';
import * as GameActions from '../../GameActions/GameActions.js';
import type Player from '../../player.js';

class ConsumedByFiveFires extends DrawCard {
    static id = 'consumed-by-five-fires';

    setupCardAbilities() {
        this.action({
            title: 'Remove up to 5 fate from characters',
            condition: (context: AbilityContext) =>
                context.player.cardsInPlay.some((card: BaseCard) => card.hasTrait('shugenja')) &&
                !!context.player.opponent &&
                context.player.opponent.cardsInPlay.some((card: BaseCard) => card.allowGameAction('removeFate', context)),
            effect: 'remove fate from {1}\'s characters',
            effectArgs: (context: AbilityContext) => context.player.opponent as Player,
            handler: (context: any) => this.chooseCard(context, {}, [])
        });
    }

    chooseCard(context: AbilityContext, targets: Record<string, number>, messages: string[]) {
        const fateRemaining = 5 - Object.values(targets).reduce((totalFate: number, fateToRemove: number) => totalFate + fateToRemove, 0);
        if(!context.player.opponent) {
            return;
        }
        const opponent = context.player.opponent;
        if(fateRemaining === 0 || !opponent.cardsInPlay.some((card: BaseCard) => card.allowGameAction('removeFate', context) && !Object.keys(targets).includes(card.uuid))) {
            this.game.addMessage('{0} chooses to: {1}', context.player, messages);
            const keys = Object.keys(targets);
            const events = keys.map(key => {
                const card = opponent.cardsInPlay.find((c: BaseCard) => c.uuid === key);
                if(card) {
                    return GameActions.removeFate({ amount: targets[key] }).getEvent(card, context);
                }
                return undefined;
            }).filter((obj): obj is Event => !!obj);
            this.game.openThenEventWindow(events);
            return;
        }
        this.game.promptForSelect(context.player, {
            context: context,
            cardType: CardTypes.Character,
            cardCondition: (card: BaseCard) => card.location === Locations.PlayArea && card.allowGameAction('removeFate', context) && card.controller !== context.player && !Object.keys(targets).includes(card.uuid),
            onSelect: (player: Player, card: BaseCard) => {
                const maxFate = Math.min(fateRemaining, card.getFate());
                const choices: (number | string)[] = Array.from({ length: maxFate }, (_, i) => i + 1);
                const handlers: (() => void)[] = (choices as number[]).map((choice: number) => {
                    return () => {
                        targets[card.uuid] = choice;
                        messages.push('take ' + choice.toString() + ' fate from ' + card.name);
                        this.chooseCard(context, targets, messages);
                    };
                });
                choices.push('Redo');
                handlers.push(() => {
                    this.chooseCard(context, {}, []);
                });
                this.game.promptWithHandlerMenu(player, {
                    activePromptTitle: 'How much fate do you want to remove?',
                    choices: choices,
                    handlers: handlers,
                    context: context
                });
                return true;
            },
            onCancel: () => {
                this.game.addMessage('{0} chooses to: {1}', context.player, messages);
                const keys = Object.keys(targets);
                const events = this.game.applyGameAction(context, { removeFate: opponent.cardsInPlay.filter((card: BaseCard) => keys.includes(card.uuid)) }) as any;
                events.forEach((event: any) => event.fate = targets[event.card.uuid]);
                return true;
            }
        });
    }
}


export default ConsumedByFiveFires;
