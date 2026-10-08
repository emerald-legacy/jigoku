import { TargetMode, Players, Phase, CardType, Duration } from '../../../Constants.js';
import { addKeyword } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class AcademyOfEtiquette extends DrawCard {
    static id = 'academy-of-etiquette';

    setupCardAbilities() {
        this.reaction('Give characters courtesy')
            .when({
                onPhaseStarted: (event) => event.phase === Phase.Fate
            })
            .targetCards({
                mode: TargetMode.UpTo,
                numCards: 2,
                activePromptTitle: 'Choose up to 2 cards',
                cardType: CardType.Character,
                cardCondition: (card) => card.isHonored,
                controller: Players.Self
            }, cardLastingEffect(() => ({
                effect: addKeyword('courtesy'),
                duration: Duration.UntilEndOfPhase
            })))
            .effect('give {0} courtesy');
    }
}
