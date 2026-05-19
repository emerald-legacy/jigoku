import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { PlayTypes } from '../../Constants.js';

class KhanbulakBenefactor extends DrawCard {
    static id = 'khanbulak-benefactor';

    setupCardAbilities() {
        this.dire({
            condition: context => context.source.isParticipating(),
            effect: AbilityDsl.effects.reduceCost({
                amount: 1,
                playingTypes: PlayTypes.PlayFromHand
            })
        });

        this.reaction({
            title: 'Draw 2 cards',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            gameAction: AbilityDsl.actions.draw({ amount: 2 })
        });
    }
}


export default KhanbulakBenefactor;
