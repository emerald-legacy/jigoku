import { TargetMode, Players, Phases, CardType, Duration } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class AcademyOfEtiquette extends DrawCard {
    static id = 'academy-of-etiquette';

    setupCardAbilities() {
        this.reaction('Give characters courtesy')
            .when({
                onPhaseStarted: (event) => event.phase === Phases.Fate
            })
            .targetCards('target', {
                mode: TargetMode.UpTo,
                numCards: 2,
                activePromptTitle: 'Choose up to 2 cards',
                cardType: CardType.Character,
                cardCondition: (card) => card.isHonored,
                controller: Players.Self
            }, AbilityDsl.actions.cardLastingEffect(() => ({
                effect: AbilityDsl.effects.addKeyword('courtesy'),
                duration: Duration.UntilEndOfPhase
            })))
            .effect('give {0} courtesy');
    }
}
