import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, Durations } from '../../Constants.js';

class AgashaHiyori extends DrawCard {
    static id = 'agasha-hiyori';

    setupCardAbilities() {
        this.reaction({
            title: 'Blank an attachment',
            when: {
                onPhaseStarted: (event) => event.phase !== 'setup'
            },
            cost: AbilityDsl.costs.payFateToRing(1),
            target: {
                cardType: CardTypes.Attachment,
                cardCondition: (card) => card.parent && card.parent.type === CardTypes.Character,
                targets: true,
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    duration: Durations.UntilEndOfPhase,
                    effect: AbilityDsl.effects.blank()
                })
            },
            effect: 'treat {1} as if its printed text box were blank and as if it had no skill modifiers until the end of the phase',
            effectArgs: (context) => (context.target as DrawCard)
        });
    }
}


export default AgashaHiyori;
