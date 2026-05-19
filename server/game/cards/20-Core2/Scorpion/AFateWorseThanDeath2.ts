import { CardTypes, Durations } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class AFateWorseThanDeath2 extends DrawCard {
    static id = 'a-fate-worse-than-death-2';

    setupCardAbilities() {
        this.action({
            title: 'Bow, move home, dishonor, remove a fate and blank a character',
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isParticipating(),
                gameAction: [
                    AbilityDsl.actions.bow(),
                    AbilityDsl.actions.dishonor(),
                    AbilityDsl.actions.removeFate(),
                    AbilityDsl.actions.sendHome(),
                    AbilityDsl.actions.cardLastingEffect({
                        duration: Durations.UntilEndOfPhase,
                        effect: AbilityDsl.effects.blank()
                    })
                ]
            },
            effect: 'bow, dishonor, blank, move home, and remove a fate from {0}'
        });
    }
}
