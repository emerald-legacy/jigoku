import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class CourtMask extends DrawCard {
    static id = 'court-mask';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.action('Return court mask to hand')
            .effect('return {0} to hand, dishonoring {1}', (context) => context.source.parentCharacter ?? '')
            .gameAction(
                AbilityDsl.actions.returnToHand(),
                AbilityDsl.actions.dishonor((context) => ({ target: context.source.parentCharacter ?? [] }))
            );
    }
}


export default CourtMask;
