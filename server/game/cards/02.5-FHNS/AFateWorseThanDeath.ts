import DrawCard from '../../DrawCard.js';
import { Duration, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class AFateWorseThanDeath extends DrawCard {
    static id = 'a-fate-worse-than-death';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Bow, move home, dishonor, remove a fate and blank a character',

            target: {
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: [
                    ability.actions.bow(),
                    ability.actions.dishonor(),
                    ability.actions.removeFate(),
                    ability.actions.sendHome(),
                    ability.actions.cardLastingEffect({
                        duration: Duration.UntilEndOfPhase,
                        effect: ability.effects.blank()
                    })
                ]
            },
            effect: 'bow, dishonor, blank, move home, and remove a fate from {0}'
        });
    }
}


export default AFateWorseThanDeath;
