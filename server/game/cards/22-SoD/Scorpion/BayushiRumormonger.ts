import type { AbilityContext } from '../../../AbilityContext.js';
import { discardCard } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class BayushiRumormonger extends DrawCard {
    static id = 'bayushi-rumormonger';

    public setupCardAbilities() {
        this.action('Discard cards from opponent\'s conflict deck')
            .condition(context => context.source.isParticipating() && Boolean(context.player.opponent))
            .gameAction(discardCard(context => ({
                target: context.player.opponent?.conflictDeck.slice(0, this.getHighestNumberOfParticipants(context)) ?? []
            })))
            .effect('discard {1} card{2} from {3}\'s conflict deck', context => {
                const x = this.getHighestNumberOfParticipants(context);
                const opponent = context.player.opponent;
                return [x, x === 1 ? '' : 's', opponent ?? ''];
            });
    }

    private getHighestNumberOfParticipants(context: AbilityContext) {
        const conflict = context.game.currentConflict;
        if(!conflict) {
            return 0;
        }
        const opponent = context.player.opponent;
        return Math.max(
            conflict.getNumberOfParticipantsFor(context.player),
            opponent ? conflict.getNumberOfParticipantsFor(opponent) : 0
        );
    }
}
