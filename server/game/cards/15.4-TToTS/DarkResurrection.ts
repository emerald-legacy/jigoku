import DrawCard from '../../DrawCard.js';
import { Locations, Players, TargetModes, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class DarkResurrection extends DrawCard {
    static id = 'dark-resurrection';

    setupCardAbilities() {
        this.action({
            title: 'Put characters into play from your discard',
            condition: () => this.game.isDuringConflict('military'),
            target:{
                activePromptTitle: 'Choose up to three characters',
                numCards: 3,
                mode: TargetModes.UpTo,
                optional: true,
                cardType: CardTypes.Character,
                location: [Locations.DynastyDiscardPile],
                controller: Players.Self,
                cardCondition: card => card.type === CardTypes.Character && card.printedCost <= 3,
                gameAction: AbilityDsl.actions.putIntoConflict({ status: 'dishonored' })

            }
        });
    }

    isTemptationsMaho() {
        return true;
    }
}


export default DarkResurrection;

