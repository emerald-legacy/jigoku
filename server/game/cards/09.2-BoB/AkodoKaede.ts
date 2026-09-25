import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Location } from '../../Constants.js';

class AkodoKaede extends DrawCard {
    static id = 'akodo-kaede';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.immunity({
                restricts: 'opponentsRingEffects'
            })
        });

        this.wouldInterrupt('Prevent a character from leaving play')
            .when({
                onCardLeavesPlay: (event, context) => event.card.type === CardType.Character && event.card !== context.source && event.card.location === Location.PlayArea
            })
            .gameAction(AbilityDsl.actions.cancel(context => ({
                target: context.source,
                replacementGameAction: AbilityDsl.actions.removeFate()
            })))
            .effect('prevent {1} from leaving play', context => context.event.card ?? '');
    }
}


export default AkodoKaede;

