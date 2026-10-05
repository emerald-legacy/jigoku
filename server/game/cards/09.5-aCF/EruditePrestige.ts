import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class EruditePrestige extends DrawCard {
    static id = 'erudite-prestige';

    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'courtier'
        });

        this.reaction('Give attached character +1 political')
            .when({
                onCardPlayed: (event, context) => context.source.parentCharacter && event.player === context.player && context.source.parentCharacter.isParticipating()
            })
            .gameAction(AbilityDsl.actions.cardLastingEffect(context => ({
                target: context.source.parentCharacter ?? [],
                effect: AbilityDsl.effects.modifyPoliticalSkill(1)
            })))
            .effect('give +1{1} to {2}', context => ['political', context.source.parentCharacter])
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }
}


export default EruditePrestige;
