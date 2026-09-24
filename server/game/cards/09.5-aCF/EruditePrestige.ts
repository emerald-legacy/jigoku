import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class EruditePrestige extends DrawCard {
    static id = 'erudite-prestige';

    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'courtier'
        });

        this.reaction({
            title: 'Give attached character +1 political',
            limit: AbilityDsl.limit.unlimitedPerConflict(),
            when: {
                onCardPlayed: (event, context) => context.source.parentCharacter && event.player === context.player && context.source.parentCharacter.isParticipating()
            },
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                target: context.source.parentCharacter,
                effect: AbilityDsl.effects.modifyPoliticalSkill(1)
            })),
            effect: 'give +1{1} to {2}',
            effectArgs: context => ['political', context.source.parentCharacter as DrawCard]
        });
    }
}


export default EruditePrestige;
