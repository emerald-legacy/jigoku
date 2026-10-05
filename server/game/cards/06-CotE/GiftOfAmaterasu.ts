import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Players } from '../../Constants.js';

class GiftofAmaterasu extends DrawCard {
    static id = 'gift-of-amaterasu';

    setupCardAbilities() {
        this.reaction('Honor a character')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.player && (event.conflict.skillDifference ?? 0) >= 5
            })
            .target({
                cardType: CardType.Character,
                activePromptTitle: 'Choose a character to honor',
                controller: Players.Self
            }, AbilityDsl.actions.honor())
            .cannotBeMirrored();
    }
}


export default GiftofAmaterasu;
