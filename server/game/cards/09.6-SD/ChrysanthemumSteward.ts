import DrawCard from '../../DrawCard.js';
import { Locations, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ChrysanthemumSteward extends DrawCard {
    static id = 'chrysanthemum-steward';

    setupCardAbilities() {
        this.action({
            title: 'put a conflict card on top',
            condition: context => context.source.isParticipating(),
            target: {
                location: Locations.ConflictDiscardPile,
                controller: Players.Opponent
            },
            gameAction: AbilityDsl.actions.moveCard(context => ({
                target: context.target,
                destination: Locations.ConflictDeck
            }))
        });
    }
}


export default ChrysanthemumSteward;
