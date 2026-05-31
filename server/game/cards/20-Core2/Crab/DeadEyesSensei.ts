import { CardTypes, Durations, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class DeadEyesSensei extends DrawCard {
    static id = 'dead-eyes-sensei';

    public setupCardAbilities() {
        this.action({
            title: 'Ready a character and give them Berserker',
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.ready(),
                    AbilityDsl.actions.removeFate(),
                    AbilityDsl.actions.cardLastingEffect({
                        duration: Durations.UntilEndOfPhase,
                        effect: AbilityDsl.effects.addTrait('berserker')
                    })
                ])
            },
            effect: 'ready and remove a fate from {0}, giving them the Berserker trait'
        });
    }
}
