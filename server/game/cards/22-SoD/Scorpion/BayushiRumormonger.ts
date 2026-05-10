import { Locations } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class BayushiRumormonger extends DrawCard {
    static id = 'bayushi-rumormonger';

    public setupCardAbilities() {
        this.action({
            title: 'Discard cards from opponent\'s conflict deck',
            condition: context => context.game.isDuringConflict() && Boolean(context.player.opponent),
            gameAction: AbilityDsl.actions.handler({
                handler: context => {
                    const x = this.getHighestNumberOfParticipants(context);
                    context.player.opponent.conflictDeck.slice(0, x).forEach(card =>
                        context.player.opponent.moveCard(card, Locations.ConflictDiscardPile)
                    );
                }
            }),
            effect: 'discard {1} card{2} from {3}\'s conflict deck',
            effectArgs: context => {
                const x = this.getHighestNumberOfParticipants(context);
                return [x, x === 1 ? '' : 's', context.player.opponent];
            }
        });
    }

    getHighestNumberOfParticipants(context) {
        const conflict = context.game.currentConflict;
        return Math.max(
            conflict.getNumberOfParticipantsFor(context.player),
            conflict.getNumberOfParticipantsFor(context.player.opponent)
        );
    }
}
