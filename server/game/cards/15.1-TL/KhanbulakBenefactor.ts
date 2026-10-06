import DrawCard from '../../DrawCard.js';
import { reduceCost } from '../../effects.js';
import { draw } from '../../GameActions/GameActions.js';
import { PlayType } from '../../Constants.js';

class KhanbulakBenefactor extends DrawCard {
    static id = 'khanbulak-benefactor';

    setupCardAbilities() {
        this.dire({
            condition: context => context.source.isParticipating(),
            effect: reduceCost({
                amount: 1,
                playingTypes: PlayType.PlayFromHand
            })
        });

        this.reaction('Draw 2 cards')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source
            })
            .gameAction(draw({ amount: 2 }));
    }
}


export default KhanbulakBenefactor;
