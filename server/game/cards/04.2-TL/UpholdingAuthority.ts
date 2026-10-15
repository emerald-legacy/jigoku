import { Trait } from '../../Constants.js';
import { msg } from '../../GameChat.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { modifyProvinceStrength } from '../../effects.js';
import { cardMenu, chooseAmount, discardCard, lookAt, sequential } from '../../GameActions/GameActions.js';
import { targetList, type GameActionTarget } from '../../GameActions/GameAction.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';

export default class UpholdingAuthority extends ProvinceCard {
    static id = 'upholding-authority';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => !!(context.player.role && context.player.role.hasTrait(Trait.Earth)),
            effect: modifyProvinceStrength(2)
        });

        const gameAction = chooseAmount((context) => ({
            activePromptTitle: 'Choose how many cards to discard',
            max: (target) => this.copiesInHand(context, target).length,
            gameAction: (amount, target) => discardCard({ target: this.copiesInHand(context, target).slice(0, amount) }),
            message: (context, amount, _chooser, target) =>
                msg`${context.player} chooses to discard ${amount} cop${amount === 1 ? 'y' : 'ies'} of ${targetList(target)[0]}`
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
                        : [{ text: 'Don\'t discard anything', handler: () => context.game.addMessage(msg`${context.player} chooses not to discard anything`) }]
                }))
            ]))
            .chatText('look at the attacking player\'s hand and choose a card to be discarded');
    }

    private copiesInHand(context: AbilityContext, target: GameActionTarget | GameActionTarget[] | undefined): DrawCard[] {
        const card = targetList(target)[0];
        return card instanceof DrawCard
            ? context.game.currentConflict?.attackingPlayer.hand.filter((copy) => copy.name === card.name) ?? []
            : [];
    }
}
