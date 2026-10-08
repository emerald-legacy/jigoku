import { msg } from '../../GameChat.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { modifyProvinceStrength } from '../../effects.js';
import { cardMenu, discardCard, lookAt, menuPrompt, sequential } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import type { MenuPromptProperties } from '../../GameActions/MenuPromptAction.js';

export default class UpholdingAuthority extends ProvinceCard {
    static id = 'upholding-authority';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => !!(context.player.role && context.player.role.hasTrait('earth')),
            effect: modifyProvinceStrength(2)
        });

        const gameAction = menuPrompt((context) => ({
            activePromptTitle: 'Choose how many cards to discard',
            choices: (properties) =>
                (context.game.currentConflict?.attackingPlayer.hand ?? [])
                    .filter((card) => card.name === this.chosenCard(properties)?.name)
                    .map((_, idx) => (idx + 1).toString()),
            gameAction: discardCard(),
            choiceHandler: (choice, displayMessage, properties) => {
                const chosenCard = this.chosenCard(properties);
                if(displayMessage) {
                    this.game.addMessage(
                        '{0} chooses to discard {1} cop{2} of {3}',
                        context.player,
                        choice,
                        choice === '1' ? 'y' : 'ies',
                        chosenCard
                    );
                }
                return {
                    target: context.game.currentConflict?.attackingPlayer.hand
                        .filter((card) => card.name === chosenCard?.name)
                        .slice(0, parseInt(choice))
                };
            }
        }));

        this.interrupt('Look at the attacking player\'s hand and discard all copies of a card')
            .when({
                onBreakProvince: (event, context) =>
                    event.card === context.source &&
                    context.game.currentConflict &&
                    context.game.currentConflict.attackingPlayer.hand.length > 0
            })
            .gameAction(sequential([
                lookAt((context) => ({
                    target: context.game.currentConflict?.attackingPlayer.hand.slice().sort((a, b) => a.name.localeCompare(b.name)),
                    message: (context, cards) => msg`${context.game.currentConflict?.attackingPlayer} reveals their hand: ${cards}`
                })),
                cardMenu((context) => ({
                    activePromptTitle: 'Choose a card to discard',
                    cards: context.game.currentConflict?.attackingPlayer.hand.slice().sort((a, b) => a.name.localeCompare(b.name)) ?? [],
                    targets: true,
                    gameAction: gameAction,
                    options: context.choosingPlayerOverride
                        ? []
                        : [{ text: 'Don\'t discard anything', handler: () => context.game.addMessage('{0} chooses not to discard anything', context.player) }]
                }))
            ]))
            .chatText('look at the attacking player\'s hand and choose a card to be discarded');
    }

    private chosenCard(properties: MenuPromptProperties): DrawCard | undefined {
        const card = Array.isArray(properties.target) ? properties.target[0] : properties.target;
        return card instanceof DrawCard ? card : undefined;
    }
}
