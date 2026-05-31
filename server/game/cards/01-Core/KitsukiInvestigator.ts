import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';

class KitsukiInvestigator extends DrawCard {
    static id = 'kitsuki-investigator';

    setupCardAbilities() {
        this.action({
            title: 'Look at opponent\'s hand',
            condition: context => context.source.isParticipating() && this.game.isDuringConflict('political') &&
                                  !!context.player.opponent && context.player.opponent.hand.length > 0,
            cost: AbilityDsl.costs.payFateToRing(),
            effect: 'reveal {1}\'s hand and discard a card from it',
            effectArgs: context => context.player.opponent ?? context.player,
            gameAction: [
                AbilityDsl.actions.lookAt((context: AbilityContext) => ({
                    target: (context.player.opponent as Player).hand.slice().sort((a: DrawCard, b: DrawCard) => a.name.localeCompare(b.name))
                })),
                AbilityDsl.actions.cardMenu((context: AbilityContext) => ({
                    cards: (context.player.opponent as Player).hand.slice().sort((a: DrawCard, b: DrawCard) => a.name.localeCompare(b.name)),
                    targets: true,
                    message: '{0} chooses {1} to be discarded',
                    messageArgs: (card: any) => [context.player, card],
                    gameAction: AbilityDsl.actions.discardCard()
                }))
            ],
            max: AbilityDsl.limit.perConflict(1)
        });
    }
}


export default KitsukiInvestigator;
