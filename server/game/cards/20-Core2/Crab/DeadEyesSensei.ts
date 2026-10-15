import { CardType, Duration, Players, Trait } from '../../../Constants.js';
import { addTrait } from '../../../effects.js';
import { cardLastingEffect, multiple, ready, removeFate } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class DeadEyesSensei extends DrawCard {
    static id = 'dead-eyes-sensei';

    public override setupCardAbilities() {
        this.action('Ready a character and give them Berserker')
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, multiple([
                ready(),
                removeFate(),
                cardLastingEffect({
                    duration: Duration.UntilEndOfPhase,
                    effect: addTrait(Trait.Berserker)
                })
            ]))
            .chatText('ready and remove a fate from {0}, giving them the Berserker trait');
    }
}
