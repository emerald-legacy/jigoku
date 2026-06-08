import DrawCard from '../../DrawCard.js';
import { Location, Players, TargetMode, CardType } from '../../Constants.js';
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
                mode: TargetMode.UpTo,
                optional: true,
                cardType: CardType.Character,
                location: [Location.DynastyDiscardPile],
                controller: Players.Self,
                cardCondition: card => card.type === CardType.Character && (card.printedCost ?? 0) <= 3,
                gameAction: AbilityDsl.actions.putIntoConflict({ status: 'dishonored' })

            }
        });
    }

    isTemptationsMaho() {
        return true;
    }
}


export default DarkResurrection;

