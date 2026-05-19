import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class BetrayalOfTruth extends DrawCard {
    static id = 'betrayal-of-truth';

    setupCardAbilities() {
        this.action({
            title: 'Bow honored and dishonored characters',
            condition: context => context.game.isDuringConflict() && context.game.findAnyCardsInPlay(card => card.isParticipating() && !card.isOrdinary()).length > 0,
            gameAction: AbilityDsl.actions.bow(context => ({
                target: context.game.findAnyCardsInPlay(card => card.isParticipating() && !card.isOrdinary())
            }))
        });
    }
}


export default BetrayalOfTruth;
