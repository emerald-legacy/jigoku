import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import type { MenuPromptProperties } from '../../GameActions/MenuPromptAction.js';

export default class UpholdingAuthority extends ProvinceCard {
    static id = 'upholding-authority';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => !!(context.player.role && context.player.role.hasTrait('earth')),
            effect: AbilityDsl.effects.modifyProvinceStrength(2)
        });

        let gameAction = AbilityDsl.actions.menuPrompt((context) => ({
            activePromptTitle: 'Choose how many cards to discard',
            choices: (properties: MenuPromptProperties) =>
                (context.game.currentConflict?.attackingPlayer.hand ?? [])
                    .filter((card) => card.name === this.chosenCard(properties)?.name)
                    .map((_, idx) => (idx + 1).toString()),
            gameAction: AbilityDsl.actions.discardCard(),
            choiceHandler: (choice, displayMessage, properties: MenuPromptProperties) => {
                let chosenCard = this.chosenCard(properties);
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
                        .filter((card: DrawCard) => card.name === chosenCard?.name)
                        .slice(0, parseInt(choice))
                };
            }
        }));

        this.interrupt('Look at the attacking player\'s hand and discard all copies of a card')
            .when({
                onBreakProvince: (event, context) =>
                    event.card === context.source &&
                    context.game.currentConflict &&
                    context.game.currentConflict.attackingPlayer &&
                    context.game.currentConflict.attackingPlayer.hand.length > 0
            })
            .gameAction(AbilityDsl.actions.sequential([
                AbilityDsl.actions.lookAt((context) => ({
                    target: context.game.currentConflict?.attackingPlayer.hand.slice().sort((a: DrawCard, b: DrawCard) => a.name.localeCompare(b.name)),
                    message: '{0} reveals their hand: {1}',
                    messageArgs: (cards) => [context.game.currentConflict?.attackingPlayer, cards]
                })),
                AbilityDsl.actions.cardMenu((context) => ({
                    activePromptTitle: 'Choose a card to discard',
                    cards: context.game.currentConflict?.attackingPlayer.hand.slice().sort((a: DrawCard, b: DrawCard) => a.name.localeCompare(b.name)) ?? [],
                    targets: true,
                    gameAction: gameAction,
                    choices: context.choosingPlayerOverride ? [] : ['Don\'t discard anything'],
                    handlers: context.choosingPlayerOverride
                        ? []
                        : [() => context.game.addMessage('{0} chooses not to discard anything', context.player)]
                }))
            ]))
            .effect('look at the attacking player\'s hand and choose a card to be discarded');
    }

    // the card chosen from the menu this prompt belongs to
    private chosenCard(properties: MenuPromptProperties): DrawCard | undefined {
        const card = Array.isArray(properties.target) ? properties.target[0] : properties.target;
        return card instanceof DrawCard ? card : undefined;
    }
}
