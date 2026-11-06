import DrawCard from '../../DrawCard.js';
import { Location, Players } from '../../Constants.js';
import { moveCard } from '../../GameActions/GameActions.js';

class BladeOf10000Battles extends DrawCard {
    static id = 'blade-of-10-000-battles';

    override setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            unique: true
        });

        this.reaction('Add a card from the discard pile to the hand')
            .when({
                afterConflict: (event, context) => !!context.source.parentCharacter && event.conflict.isOnWinningSide(context.source.parentCharacter) &&
                                                    context.player.isMoreHonorable()
            })
            .target({
                activePromptTitle: 'Choose a card from your conflict discard pile to add to your hand',
                location: Location.ConflictDiscardPile,
                controller: Players.Self
            }, moveCard({ destination: Location.Hand }));
    }
}


export default BladeOf10000Battles;
