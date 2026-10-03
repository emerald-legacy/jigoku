import DrawCard from '../../../DrawCard.js';
import { Location, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class ManipulativeScout extends DrawCard {
    static id = 'manipulative-scout';

    setupCardAbilities() {
        this.action('Flip a card in a province')
            .target('target', {
                controller: Players.Any,
                location: Location.Provinces,
                cardCondition: card => card.isDynasty
            }, AbilityDsl.actions.flipDynasty(), AbilityDsl.actions.turnFacedown());
    }
}
