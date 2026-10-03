import { CardType, Duration, Location } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class ShibaYohana extends DrawCard {
    static id = 'shiba-yohana';

    public setupCardAbilities() {
        this.wouldInterrupt('Prevent this character from leaving play')
            .when({
                onCardLeavesPlay: (event, context) =>
                    event.card === context.source && event.card.location === Location.PlayArea
            })
            .gameAction(AbilityDsl.actions.cancel((context) => ({
                target: context.source,
                replacementGameAction: AbilityDsl.actions.taint()
            })))
            .effect('prevent {1} from leaving play - vengeance and destruction sustains her in a damned existence', (context) => context.event.card ?? '')
            .then((context) => ({
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    target: context?.source,
                    duration: Duration.Custom,
                    until: {
                        onCardLeavesPlay: (event) => event.card === context?.source
                    },
                    effect: AbilityDsl.effects.addTrait('spirit')
                })
            }));

        this.action('Move a character into the conflict')
            .condition((context) => context.source.isParticipating())
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card) => card.isHonored || card.isDishonored
            }, AbilityDsl.actions.moveToConflict());
    }
}
