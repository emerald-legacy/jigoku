import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../BaseCard.js';
import type DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';
import { TargetMode } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class ShamefulDisplay extends ProvinceCard {
    static id = 'shameful-display';

    setupCardAbilities() {
        this.action({
            title: 'Dishonor/Honor two characters',
            target: {
                mode: TargetMode.Exactly,
                numCards: 2,
                activePromptTitle: 'Select two characters',
                cardCondition: card => card.isParticipating(),
                gameAction: [AbilityDsl.actions.honor(), AbilityDsl.actions.dishonor()]
            },
            effect: 'change the personal honor of {0}',
            handler: (context: AbilityContext) => {
                if(!context.target) {
                    return;
                }
                const targets = context.getCards<DrawCard>('target');
                if(targets.every((card: DrawCard) => !card.allowGameAction('honor', context))) {
                    this.game.promptForSelect(context.player, {
                        activePromptTitle: 'Choose a character to dishonor',
                        context: context,
                        gameAction: AbilityDsl.actions.dishonor(),
                        cardCondition: (card: DrawCard) => targets.includes(card),
                        onSelect: (_player: Player, card: DrawCard) => {
                            this.resolveShamefulDisplay(
                                context,
                                targets.find((c: DrawCard) => c !== card),
                                card
                            );
                            return true;
                        }
                    });
                } else if(targets.every((card: DrawCard) => !card.allowGameAction('dishonor', context))) {
                    this.game.promptForSelect(context.player, {
                        activePromptTitle: 'Choose a character to honor',
                        context: context,
                        gameAction: AbilityDsl.actions.honor(),
                        cardCondition: (card: DrawCard) => targets.includes(card),
                        onSelect: (_player: Player, card: DrawCard) => {
                            this.resolveShamefulDisplay(
                                context,
                                card,
                                targets.find((c: DrawCard) => c !== card)
                            );
                            return true;
                        }
                    });
                } else {
                    this.promptToChooseHonorOrDishonor(targets, context);
                }
            }
        });
    }

    promptToChooseHonorOrDishonor(cards: DrawCard[], context: AbilityContext) {
        let choices = ['Honor', 'Dishonor'];
        let handlers = choices.map((choice) => {
            return () => this.chooseCharacter(choice, cards, context);
        });
        this.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: 'Choose a character to:',
            context: context,
            choices: choices,
            handlers: handlers
        });
    }

    chooseCharacter(choice: string, cards: DrawCard[], context: AbilityContext) {
        let promptTitle = 'Choose a character to dishonor';
        let condition = (card: DrawCard) => cards.includes(card) && card.allowGameAction('dishonor', context);
        if(choice === 'Honor') {
            promptTitle = 'Choose a character to honor';
            condition = (card: DrawCard) => cards.includes(card) && card.allowGameAction('honor', context);
        }
        this.game.promptForSelect(context.player, {
            activePromptTitle: promptTitle,
            context: context,
            cardCondition: condition,
            buttons: [{ text: 'Back', arg: 'back' }],
            onSelect: (_player: Player, card: DrawCard) => {
                let otherCard = cards.find((c) => c !== card);
                if(choice === 'Honor') {
                    this.resolveShamefulDisplay(context, card, otherCard);
                } else {
                    this.resolveShamefulDisplay(context, otherCard, card);
                }
                return true;
            },
            onMenuCommand: (_player: Player, arg: string) => {
                if(arg === 'back') {
                    this.promptToChooseHonorOrDishonor(cards, context);
                    return true;
                }
                return false;
            }
        });
    }

    resolveShamefulDisplay(context: AbilityContext, cardToHonor: BaseCard | undefined, cardToDishonor: BaseCard | undefined) {
        this.game.applyGameAction(context, { honor: cardToHonor, dishonor: cardToDishonor });
    }
}
