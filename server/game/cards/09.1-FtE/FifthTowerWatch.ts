import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, CardTypes, Locations } from '../../Constants.js';

class FifthTowerWatch extends DrawCard {
    static id = 'fifth-tower-watch';

    setupCardAbilities() {
        this.interrupt({
            title: 'Bow a character',
            when: {
                onCardLeavesPlay: (event: any, context) => event.isSacrifice && event.card.controller === context.player && event.card.location === Locations.PlayArea
            },
            target: {
                player: Players.Opponent,
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => card.getMilitarySkill() < context.event.card.getMilitarySkill(),
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}


export default FifthTowerWatch;
