import { msg } from '../../../GameChat.js';
import { CardType, Duration, Location, Trait } from '../../../Constants.js';
import { addTrait } from '../../../effects.js';
import { moveToConflict, taint } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class ShibaYohana extends DrawCard {
    static id = 'shiba-yohana';

    public override setupCardAbilities() {
        this.wouldInterrupt('Prevent this character from leaving play')
            .when({
                onCardLeavesPlay: (event, context) =>
                    event.card === context.source && event.card.location === Location.PlayArea
            })
            .cancel((context) => ({
                target: context.source,
                replacementGameAction: taint()
            }))
            .chatText((context) => msg`prevent ${context.event.card} from leaving play - vengeance and destruction sustains her in a damned existence`)
            .afterwards()
            .cardLastingEffect((context) => ({
                target: context.source,
                duration: Duration.Custom,
                until: {
                    onCardLeavesPlay: (event) => event.card === context.source
                },
                effect: addTrait(Trait.Spirit)
            }));

        this.conflictAction('Move a character into the conflict')
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isHonored || card.isDishonored
            }, moveToConflict());
    }
}
