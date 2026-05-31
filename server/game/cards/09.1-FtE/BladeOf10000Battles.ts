import DrawCard from '../../DrawCard.js';
import { Locations, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class BladeOf10000Battles extends DrawCard {
    static id = 'blade-of-10-000-battles';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            unique: true
        });

        this.reaction({
            when: {
                afterConflict: (event, context) => context.source.parent && context.source.parent.isParticipating() &&
                                                    event.conflict.winner === context.source.parent.controller &&
                                                    context.player.opponent &&
                                                    context.player.isMoreHonorable()
            },
            title: 'Add a card from the discard pile to the hand',
            target: {
                activePromptTitle: 'Choose a card from your conflict discard pile to add to your hand',
                location: Locations.ConflictDiscardPile,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.moveCard({ destination: Locations.Hand })
            }
        });
    }
}


export default BladeOf10000Battles;
