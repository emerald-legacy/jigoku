import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';
import AbilityDsl from '../../abilitydsl.js';

class KitsukiInvestigator extends DrawCard {
    static id = 'kitsuki-investigator';

    setupCardAbilities() {
        this.action('Look at opponent\'s hand')
            .cost(AbilityDsl.costs.payFateToRing())
            .condition(context => context.source.isParticipating() && this.game.isDuringConflict('political') &&
                                  !!context.player.opponent && context.player.opponent.hand.length > 0)
            .gameAction(AbilityDsl.actions.lookAt((context) => ({
                target: (context.player.opponent as Player).hand.slice().sort((a: DrawCard, b: DrawCard) => a.name.localeCompare(b.name))
            })), AbilityDsl.actions.cardMenu((context) => ({
                cards: (context.player.opponent as Player).hand.slice().sort((a: DrawCard, b: DrawCard) => a.name.localeCompare(b.name)),
                targets: true,
                message: '{0} chooses {1} to be discarded',
                messageArgs: card => [context.player, card],
                gameAction: AbilityDsl.actions.discardCard()
            })))
            .effect('reveal {1}\'s hand and discard a card from it', context => context.player.opponent ?? context.player)
            .max(AbilityDsl.limit.perConflict(1));
    }
}


export default KitsukiInvestigator;
