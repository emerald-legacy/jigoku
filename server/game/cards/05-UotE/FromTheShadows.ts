import { putIntoConflict } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { Location, Players, CardType, Trait, EntersPlayStatus } from '../../Constants.js';

class FromTheShadows extends DrawCard {
    static id = 'from-the-shadows';

    override setupCardAbilities() {
        this.action('Put a shinobi character into the conflict from hand or a province, dishonored')
            .playOnlyIf((context) => !!context.player.opponent && context.player.isLessHonorable())
            .target({
                cardType: CardType.Character,
                location: [Location.Provinces, Location.Hand],
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait(Trait.Shinobi)
            }, putIntoConflict({ status: EntersPlayStatus.Dishonored }));
    }
}


export default FromTheShadows;
