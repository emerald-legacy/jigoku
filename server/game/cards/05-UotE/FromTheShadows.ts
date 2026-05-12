import DrawCard from '../../drawcard';
import { Locations, Players, CardTypes } from '../../Constants';

class FromTheShadows extends DrawCard {
    static id = 'from-the-shadows';

    setupCardAbilities(ability) {
        this.action({
            title: 'Put a shinobi character into the conflict from hand or a province, dishonored',
            target: {
                cardType: CardTypes.Character,
                location: [Locations.Provinces, Locations.Hand],
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait('shinobi'),
                gameAction: ability.actions.putIntoConflict({ status: 'dishonored' })
            }
        });
    }

    canPlay(context, type) {
        return context.player.opponent && context.player.isLessHonorable() && super.canPlay(context, type);
    }
}


export default FromTheShadows;
