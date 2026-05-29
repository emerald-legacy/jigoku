import { Locations } from '../../../Constants.js';
import { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class BayushiRumormonger extends DrawCard {
    static id = 'bayushi-rumormonger';

    public setupCardAbilities() {
        this.action({
            title: 'Discard cards from opponent\'s conflict deck',
            condition: context => context.source.isParticipating() && Boolean(context.player.opponent),
            gameAction: AbilityDsl.actions.handler({
                handler: context => {
                    const opponent = context.player.opponent;
                    if(!opponent) {
                        return;
                    }
                    const x = this.getHighestNumberOfParticipants(context);
                    opponent.conflictDeck.slice(0, x).forEach(card =>
                        opponent.moveCard(card, Locations.ConflictDiscardPile)
                    );
                }
            }),
            effect: 'discard {1} card{2} from {3}\'s conflict deck',
            effectArgs: context => {
                const x = this.getHighestNumberOfParticipants(context);
                const opponent = context.player.opponent;
                return [x, x === 1 ? '' : 's', opponent ?? ''];
            }
        });
    }

    getHighestNumberOfParticipants(context: AbilityContext) {
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
